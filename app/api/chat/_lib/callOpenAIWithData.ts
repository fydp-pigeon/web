import { Response } from '@prisma/client';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';
import OpenAI from 'openai';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const callOpenAIWithData = async ({
  input,
  metadata,
  data,
  history = [],
}: {
  input: string;
  metadata: string;
  data: string;
  history?: Response[];
}) => {
  try {
    let chatHistory = '';

    for (const { question, response } of history) {
      chatHistory += `
        User:
        ${humanPrompt({ input: question, metadata: '<redacted>', data: '<redacted>' })}
        `;
      chatHistory += '\n';
      chatHistory += `
        GPT:
        ${response}
      `;
      chatHistory += '\n';
    }

    const assistant = new OpenAIAssistantRunnable({
      assistantId: 'asst_FeiOfBQOCRF2tSp8hzx2o8tP',
    });

    const content = `
      ${chatHistory}

      User:
      ${humanPrompt({ input, metadata, data })}

      GPT:
    `;

    const responses = (await assistant.invoke({
      content,
    })) as any as ThreadMessage[];
    const responseData = responses.find(({ content }) => !!content?.length);
    const imageResponseData = responses.find(
      ({ content }) => !!content?.length && !!content.find(({ image_file }) => !!image_file),
    );

    if (!responseData) {
      throw Error('No response found from OpenAI.');
    }

    const fileId = imageResponseData?.content.find(({ type }) => type === 'image_file')?.image_file.file_id;
    const response = responseData.content.find(({ type }) => type === 'text')?.text.value;

    if (!response) {
      throw Error('No response found from OpenAI.');
    }

    console.info('File ID:', fileId);

    let imageUrl;
    if (fileId) {
      const openai = new OpenAI();
      const fileResponse = await openai.files.content(fileId);
      const imageBuffer = await fileResponse.arrayBuffer();
      console.info('File size:', imageBuffer.byteLength);
      const imageData = Buffer.from(imageBuffer).toString('base64');

      const base64Prefix = 'data:image/png;base64,';
      const { secure_url } = await cloudinary.uploader.upload(base64Prefix + imageData);

      imageUrl = secure_url;
    } else {
      console.log(JSON.stringify(responses));
    }

    console.log(imageUrl);

    return { response, imageUrl };
  } catch (e) {
    throw Error('Error calling OpenAI: ' + e);
  }
};

const humanPrompt = ({ input, metadata, data }: { input: string; metadata: string; data: string }) => `
  ---------------
  Question: """
  ${input}
  """
  Metadata: """
  ${metadata}
  """
  Data: """
  ${data}
  """
  ---------------
`;

type ThreadMessage = {
  content: {
    type: 'image_file' | 'text';
    image_file: { file_id: string };
    text: {
      value: string;
    };
  }[];
};
