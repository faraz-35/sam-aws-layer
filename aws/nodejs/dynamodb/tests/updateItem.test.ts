import { appendToArray, removeFromArray, updateItem } from "../index";

describe("DynamoDB Update Item", () => {
  const tableName = "TestTable";

  test("updateItem should update an item in the DynamoDB table", async () => {
    const key = { id: "123" };
    const object = { testId: "newTestId" };
    const result = await updateItem(key, object, tableName);

    expect(result).toHaveProperty("Attributes");
    expect(result?.Attributes?.testId).toEqual(object.testId);
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
});
