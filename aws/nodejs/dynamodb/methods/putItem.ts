import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { dbClient } from "../dbClient";

const DDBTable = process.env.TABLE_NAME;

// Put Item
export const putItem = (
  item: DocumentClient.PutItemInputAttributeMap,
  tableName: string = DDBTable!
): Promise<DocumentClient.PutItemOutput> => {
  const params: DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: {
      ...item,
    },
  };
  return dbClient.put(params).promise();
};
