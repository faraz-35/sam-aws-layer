import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { dbClient } from "../dbClient";
import { PopulateParam } from "../../types";

const DDBTable = process.env.TABLE_NAME;

// Get Item
export const getItem = async (
  key: DocumentClient.Key,
  attributes?: string[],
  tableName: string = DDBTable!,
  populate?: PopulateParam[]
): Promise<DocumentClient.GetItemOutput> => {
  const params: DocumentClient.GetItemInput = {
    TableName: tableName,
    Key: key,
    ProjectionExpression: attributes ? attributes.join(", ") : undefined,
  };
  const item = await dbClient.get(params).promise();

  //populating fieldls
  if (populate && item.Item) {
    const promises = populate.map(async (pop) => {
      const relatedKey = { id: item.Item?.[pop.fieldName] };
      const relatedParams: DocumentClient.GetItemInput = {
        TableName: pop.tableName,
        Key: relatedKey,
        ProjectionExpression: pop.attributes
          ? pop.attributes.join(", ")
          : undefined,
      };

      const relatedData = await dbClient.get(relatedParams).promise();
      if (item.Item) item.Item[pop.fieldName] = relatedData.Item;
    });

    await Promise.all(promises);
  }

  return item;
};
