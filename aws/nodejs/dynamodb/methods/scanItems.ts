import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { dbClient } from "../dbClient";
import { PopulateParam } from "../../types";

const DDBTable = process.env.TABLE_NAME;

// Scan
export const scanItems = async (
  limit?: number,
  exclusiveStartKey?: string,
  attributes?: string,
  tableName: string = DDBTable!,
  filter?: { [key: string]: any },
  populate?: PopulateParam[],
  populateFilter?: { fieldName: string; filter: { [key: string]: any } }[]
): Promise<DocumentClient.ScanOutput> => {
  const params: DocumentClient.ScanInput = {
    TableName: tableName,
    Limit: limit ?? undefined,
  };
  if (exclusiveStartKey) {
    params.ExclusiveStartKey = { id: exclusiveStartKey };
  }
  if (attributes?.length || 0 > 0) {
    params.ProjectionExpression = attributes?.split(",").join(", ");
  }
  if (filter) {
    const filterExpressions = Object.keys(filter).map(
      (key) => `${key} = :${key}`
    );
    params.FilterExpression = filterExpressions.join(" AND ");
    params.ExpressionAttributeValues = {};
    for (const key in filter) {
      params.ExpressionAttributeValues![`:${key}`] = filter[key];
    }
  }
  const data = await dbClient.scan(params).promise();

  //populate fields
  if (populate && data.Items) {
    const promises = populate.map(async (pop) => {
      if (data.Items) {
        const keys = data.Items.map((item) => ({ id: item[pop.fieldName] }));
        const relatedParams: DocumentClient.BatchGetItemInput = {
          RequestItems: {
            [pop.tableName]: {
              Keys: keys,
              ProjectionExpression: pop.attributes
                ? pop.attributes.join(", ")
                : undefined,
            },
          },
        };
        const relatedData = await dbClient.batchGet(relatedParams).promise();
        const relatedItems = relatedData.Responses?.[pop.tableName];
        for (let i = 0; i < data.Items.length; i++) {
          const relatedItem = relatedItems?.find(
            (item) => item.id === data.Items?.[i][pop.fieldName]
          );
          data.Items[i][pop.fieldName] = relatedItem;
        }
      }
    });
    await Promise.all(promises);
  }

  //filtering fields based on populateFilter
  if (populate && populateFilter && data.Items) {
    data.Items = data.Items.filter((item) => {
      return populateFilter.every((popFilter) => {
        const value = popFilter.filter;
        const itemValue = item[popFilter.fieldName];
        return (
          itemValue &&
          Object.keys(value).every((key) => itemValue[key] === value[key])
        );
      });
    });
  }

  return data;
};
