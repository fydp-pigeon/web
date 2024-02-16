// 1. Query pinecone
// 2. Query database (Potentially skip)
// 3. Download and convert data
// 4. Query GPT
// 5. Filter data
// 6. Query GPT

import { queryPinecone } from '../chat/_lib/queryPinecone';
import prisma from '@/_lib/server/prismadb';
import { generateApiResponse } from '../_lib/generateApiResponse';
import excelToJson from 'convert-excel-to-json';
import https from 'https';
import { createWriteStream } from 'fs';
import { parseString } from 'xml2js';
import csv from 'csvtojson';
import { callOpenAI } from '../chat/_lib/callOpenAI';

type Result = Record<string, any>[];

const PROMPT_BACKGROUND = `
  SYSTEM:
  Rules:
  - You are provided with the user's question and an example array schema with only one entry - the real data has thousands. 
  - You are to return a JavaScript anonymous function that takes an array of objects and returns a filtered and/or sorted array.
  - When it's not clear what date to take the data from, take the latest data available.
  - You are expected to respond only with the JavaScript filters that would yield data relevant to the user's question. 
  - Do not respond to the actual question.
  - If the user's question is general enough that no filters are relevant, respond with FILTER NOT NECESSARY.
  - If the schema does not allow itself to be filtered according to the user's question, respond with FILTER NOT NECESSARY.
  - Do not try to squeeze water from a stone - if the dataset does not contain the information necessary to answer the user's question, respond with FILTER NOT NECESSARY.
  - **Important: Filter's are supposed to be scientific and quantitative - don't do arbitrary includes on phrases of the question. If no such filters are present, then FILTER NOT NECESSARY.**
  - Do not do a redundant filter that is already addressed by the dataset title itself. 
  - For example, if the dataset title is "Oklahoma football fields", and the user is asking about football fields in Oklahoma, no need to filter by location in this case.
  - Make sure to lowercase on string filters.

  USER:
  Query: "What are names of Toronto council members that start with a L?"
  Dataset title: "People"
  Example schema: [
    { "name": "Andrew Thompson", "age": 32 },
  ]

  GPT:
  
  (arr) => arr.filter(obj => obj.name[0] === "L");

  USER:
  Query: "Can you give me some information about low income housing in Markham?"
  Dataset title: "Low Income Housing Statistics"
  Example schema: [
    { "id": "12821111", "_op_rec": 1182, "housing_units": "109", "region": "Milton East Center" },
  ]

  GPT:
  (arr) => arr.filter(obj => obj.region.toLowerCase().includes("markham"));

  USER:
  Query: "Tell me about some example luxury car models."
  Dataset title: "Luxury Cars"
  Example schema: [
    {
      "date": "2025-05-15",
      "title": "Lamborghini",
      "sku": 1228,
    }
  ]

  GPT:
  FILTER NOT NECESSARY

  USER:
  Query: "What are some public schools in tennessee that have been founded before the year 1995 and that have more than 1200 students?"
  Dataset title: "Tennessee High Schools"
  Example schema: [
    { "name": "Collegiate High", "population": 1000, "established": "2004-05-11", "slopNum": "12200HX" },
  ]

  GPT:
  (arr) => arr.filter(obj => new Date(obj.established) < new Date("1995") && obj.population > 1200);

  USER:
  Query: "What neighborhoods have the highest poverty rate this year?"
  Dataset title: "Neighborhoods"
  Example schema: [
    {
      "name": "Northern Collingwood",
      "population": 223,
      "established": "2004-05-11",
      "POPULATION_BELOW_POVERTY_LINE_2023": "12%",
      "POPULATION_BELOW_POVERTY_LINE_2022": "14%",
      "POPULATION_BELOW_POVERTY_LINE_2021": "12%"
    },
  ]

  GPT:
  (arr) => arr.sort((a, b) => parseFloat(b.POPULATION_BELOW_POVERTY_LINE_2023) - parseFloat(a.POPULATION_BELOW_POVERTY_LINE_2023)).slice(0, 3);
`;

export async function GET() {
  const userQuery = "Can you tell me about the city's affordable housing access for youth wellbeing in little italy?"; // CSV
  // const userQuery = "Can you tell me about the city's watermain breaks before 1991?"; // XLS
  // const userQuery = 'Can you tell me about the city subject thesaurus?'; // XML
  // const userQuery = "Tell me about active building permits"; // JSON
  // const userQuery = 'What 3 areas of the city has the highest criminal activity?'; // CSV
  // const userQuery =
  //   'Can you tell me about the different factors in cost of living for different income households in Toronto?'; // CSV

  //1. Query Pinecone
  const pineconeRes = await queryPinecone(userQuery);
  // const confidenceScore = pineconeRes.matches[0].score;
  // const metadata = JSON.stringify(pineconeRes.matches[0].metadata);
  const datasetID = pineconeRes.matches[0].id;

  // 2. Query database
  const dataset = await prisma.dataset.findUnique({
    where: {
      id: datasetID,
    },
  });

  if (dataset === null) {
    return generateApiResponse({ status: 404, error: 'Dataset not found' });
  }

  const datasetURL = dataset.url;
  let data: Result = [];

  // return generateApiResponse({ status: 200, data: dataset });

  switch (dataset.format) {
    case 'XLSX':
    case 'XLS': {
      await downloadFile(datasetURL, 'tmp.xlsx');
      const result = excelToJson({
        sourceFile: 'tmp.xlsx',
      });
      data = Object.values(result)[0];
      break;
    }
    case 'XML': {
      const xmlResp = await fetch(datasetURL, { cache: 'no-store' });
      const text = await xmlResp.text();
      data = await new Promise<Result>(resolve =>
        parseString(text, (_, result) => resolve(findArrayInHaystack(result) || [])),
      );

      break;
    }
    case 'CSV': {
      const csvRes = await fetch(datasetURL, { cache: 'no-store' });
      const text = await csvRes.text();

      data = await new Promise<Result>(resolve =>
        csv({
          noheader: true,
          output: 'csv',
        })
          .fromString(text)
          .then(result => {
            resolve(arraysToObjects(result));
          }),
      );
      break;
    }
    default:
      try {
        const jsonRes = await fetch(datasetURL, { cache: 'no-store' });
        const json = await jsonRes.json();

        data = findArrayInHaystack(JSON.parse(json)) || [];
      } catch (e) {
        console.log('Could not serialize data.', dataset.id, datasetURL, dataset.format);
        return null;
      }
  }

  data = sanitizeIckyData(data);

  const exampleSchema = JSON.stringify(data.slice(0, 2));
  let prompt = `
    USER:
    Query: "${userQuery}"
    Dataset title: "${dataset.title}"
    Example schema: ${exampleSchema}

    GPT:
  `;

  const response = await callOpenAI(PROMPT_BACKGROUND + prompt);

  if (response === 'FILTER NOT NECESSARY') {
    return generateApiResponse({ status: 200, data });
  }

  console.log(response);

  const filter: <T>(arr: T[]) => T[] = eval(response);

  const filteredData = filter(data);

  return generateApiResponse({ status: 200, data: filteredData });
}

const arraysToObjects = (data: any[][]) => {
  const schema = data[0];
  const result = [];

  for (let i = 1; i < data.length; i++) {
    const arr = data[i];
    const obj: Record<string, any> = {};

    for (let j = 0; j < schema.length; j++) {
      const key = schema[j];
      obj[key] = arr[j];
    }

    result.push(obj);
  }

  return result;
};

const findArrayInHaystack = (data: any): any[] | null => {
  if (Array.isArray(data)) {
    return data;
  }

  if (typeof data === 'object') {
    for (const value of Object.values(data)) {
      const result = findArrayInHaystack(value);

      if (result) {
        return result;
      }
    }
  }

  return null;
};

const downloadFile = (url: string, filePath: string) => {
  const request = https.get(url);

  return new Promise<void>((resolve, reject) => {
    const file = createWriteStream(filePath);
    request.on('response', response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    request.on('error', error => {
      reject(error);
    });
  });
};

const sanitizeIckyData = <T extends Record<string, any>>(data: T[]): T[] => {
  // Truncate all value that are too large above 100 characters
  for (const obj of data) {
    for (const key in obj) {
      let value = obj[key];
      if (typeof value === 'string' && value.length > 75) {
        obj[key] = value.slice(0, 75);
      }
    }
  }

  return data;
};
