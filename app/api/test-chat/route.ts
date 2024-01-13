// 1. Query pinecone
// 2. Query database (Potentially skip)
// 3. Download and convert data
// 4. Query GPT
// 5. Filter data
// 6. Query GPT

import { queryPinecone } from "../chat/_lib/queryPinecone";
import prisma from '@/_lib/server/prismadb';
import { generateApiResponse } from "../_lib/generateApiResponse";
import excelToJson from "convert-excel-to-json";
import https from "https";
import { createWriteStream } from "fs";

export async function GET(){
    const userQuery = "what are the locations of public libraries?";
    // const userQuery = "Tell me about active building permits";
    
    //1. Query Pinecone
    const pineconeRes = await queryPinecone(userQuery);
    // const confidenceScore = pineconeRes.matches[0].score;
    const datasetID = pineconeRes.matches[0].id;
    const metadata = JSON.stringify(pineconeRes.matches[0].metadata);

    //2. Query database
    const dataset = await prisma.dataset.findUnique({
        where: {
          id: datasetID,
        },
    });

    if (dataset === null){
        return generateApiResponse({ status: 404, error: "Dataset not found" });
    }
    // console.log(dataset.name);
    const datasetURL = dataset.url;
    

    switch(dataset.format){
        case "XLSX":
        case "XLS":{
            await downloadFile(datasetURL, 'tmp.xlsx');
            const result = excelToJson({
                sourceFile: 'tmp.xlsx'
            });
            console.log(result.Sheet1)
            break;
        }
        // default: // JSON

    }

    return generateApiResponse({ status: 200, data: {}});
    
};

export const downloadFile = (url: string, filePath: string) => {
    const request = https.get(url);
  
    return new Promise<void>((resolve, reject) => {
      const file = createWriteStream(filePath);
      request.on("response", (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      });
      request.on("error", (error) => {
        reject(error);
      });
    });
  };



