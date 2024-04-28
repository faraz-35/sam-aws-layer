import { DocumentClient } from "aws-sdk/clients/dynamodb";

const isLocal = process.env.ENV === "LOCAL";
const DDBTable = process.env.TABLE_NAME;

export const dbClient = new DocumentClient({
  endpoint: isLocal ? "http://localhost:8000" : undefined,
  region: isLocal ? "ca-central-1" : undefined,
});
