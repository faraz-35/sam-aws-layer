import {
  putItem,
  getItem,
  scan,
  queryItem,
  updateItem,
  appendToArray,
  removeFromArray,
  deleteItem,
} from "./index";

describe("DynamoDB Utility Functions", () => {
  const tableName = "TestTable";

  test("putItem should add an item to the DynamoDB table", async () => {
    const item = { id: "123", testId: "TestItem", searchId: "testSearch" };
    const result = await putItem(item, tableName);

    expect(result).toBeDefined();
  });

  test("getItem should retrieve an item from the DynamoDB table", async () => {
    const key = { id: "123" };
    const result = await getItem(key, ["testId"], tableName);

    expect(result).toHaveProperty("Item");
    expect(result.Item).toEqual({ testId: "TestItem" });
  });

  test("scan should retrieve items from the DynamoDB table", async () => {
    const result = await scan("10", undefined, undefined, tableName);

    expect(result).toHaveProperty("Items");
  });

  test("queryItem should perform a query in the DynamoDB table", async () => {
    const queryObject = { searchId: "testSearch" };
    const result = await queryItem(queryObject, tableName);

    expect(result).toHaveProperty("Items");
    expect(result?.Items?.length).toBeGreaterThan(-1);
  });

  test("updateItem should update an item in the DynamoDB table", async () => {
    const key = { id: "123" };
    const object = { testId: "newTestId" };
    const result = await updateItem(key, object, tableName);

    expect(result).toHaveProperty("Attributes");
    expect(result?.Attributes?.testId).toEqual(object.testId);
  });

  test("appendToArray should append an item to an array in the DynamoDB table", async () => {
    const key = { id: "123" };
    const object = { testId: "newTestId" };
    const result = await appendToArray(
      key,
      "testArray",
      "testValue",
      tableName
    );

    expect(result).toHaveProperty("Attributes");
    expect(result?.Attributes?.testArray).toContain("testValue");
  });

  test("removeFromArray should remove an item from an array in the DynamoDB table", async () => {
    const key = { id: "123" };
    const object = { testId: "newTestId" };
    const result = await removeFromArray(
      key,
      "testArray",
      "testValue",
      tableName
    );

    expect(result).toHaveProperty("Attributes");
    expect(result?.Attributes?.testArray).not.toContain("testValue");
  });

  test("deleteItem should delete an item from the DynamoDB table", async () => {
    const key = { id: "123" };
    const result = await deleteItem(key, tableName);

    expect(result).toBeDefined();
  });
});
