import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { dbClient } from "../dbClient";

const DDBTable = process.env.TABLE_NAME;

// Delete Item
export const deleteItem = (
  key: DocumentClient.Key,
  tableName: string = DDBTable!
): Promise<DocumentClient.DeleteItemOutput> => {
  const params: DocumentClient.DeleteItemInput = {
    TableName: tableName,
    Key: key,
  };
  return dbClient.delete(params).promise();
};
