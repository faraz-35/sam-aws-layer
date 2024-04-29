import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { dbClient } from "../dbClient";

const DDBTable = process.env.TABLE_NAME;

// Update Item
export const updateItem = (
  key: DocumentClient.Key,
  object: DocumentClient.ExpressionAttributeValueMap,
  tableName: string = DDBTable!
): Promise<DocumentClient.UpdateItemOutput> => {
  let updateExpression = "set ";
  const expressionAttributeNames: Record<string, any> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.keys(object).forEach((key, i) => {
    updateExpression += `#${key} = :${key}`;
    if (i !== Object.keys(object).length - 1) updateExpression += ", ";
    expressionAttributeNames[`#${key}`] = key;
    expressionAttributeValues[`:${key}`] = object[key];
  });

  const params: DocumentClient.UpdateItemInput = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW",
  };
  return dbClient.update(params).promise();
};

//Update append item to array
export const appendToArray = (
  key: DocumentClient.Key,
  arrayName: string,
  value: any,
  tableName: string = DDBTable!
): Promise<DocumentClient.UpdateItemOutput> => {
  const params: DocumentClient.UpdateItemInput = {
    TableName: tableName,
    Key: key,
    UpdateExpression: `SET #${arrayName} = list_append(if_not_exists(#${arrayName}, :empty_list), :new_value)`,
    ExpressionAttributeNames: {
      [`#${arrayName}`]: arrayName,
    },
    ExpressionAttributeValues: {
      ":new_value": [value],
      ":empty_list": [],
    },
    ReturnValues: "UPDATED_NEW",
  };
  return dbClient.update(params).promise();
};

//Update remove item form  array
export const removeFromArray = async (
  key: DocumentClient.Key,
  arrayName: string,
  value: any,
  tableName: string = DDBTable!
): Promise<DocumentClient.UpdateItemOutput> => {
  // Get the current item
  const currentItem = await dbClient
    .get({ TableName: tableName, Key: key })
    .promise();

  // Remove the value from the array
  const array = currentItem?.Item?.[arrayName];
  const index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  }

  // Update the item in DynamoDB
  const params: DocumentClient.UpdateItemInput = {
    TableName: tableName,
    Key: key,
    UpdateExpression: `SET #${arrayName} = :new_array`,
    ExpressionAttributeNames: {
      [`#${arrayName}`]: arrayName,
    },
    ExpressionAttributeValues: {
      ":new_array": array,
    },
    ReturnValues: "UPDATED_NEW",
  };
  return dbClient.update(params).promise();
};
