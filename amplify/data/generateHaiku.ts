import { MODEL_ID, type Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

// initialize bedrock runtime client
const client = new BedrockRuntimeClient({
  region: "us-east-2",
});

export const handler: Schema["generateHaiku"]["functionHandler"] = async (
  event
) => {
  // User prompt
  const prompt = event.arguments.prompt;

  // Invoke model
  const input = {
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: `Human: You are an expert at crafting haiku. Create a haiku based on the following prompt: ${prompt}\n\nAssistant:`,
      max_gen_len: 512,
      temperature: 0.5,
      top_p: 0.9,
    }),
  } as InvokeModelCommandInput;

  const command = new InvokeModelCommand(input);

  const response = await client.send(command);

  // Parse the response and return the generated haiku
  const data = JSON.parse(Buffer.from(response.body).toString());

  return data.content[0].text;
};
