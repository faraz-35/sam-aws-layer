import { getItem } from "../index";

describe("DynamoDB Get Item ", () => {
  const tableName = "TestTable";

  test("getItem should retrieve specific attributes from an item in the DynamoDB table", async () => {
    const key = { id: "123" };
    const result = await getItem(key, ["testId"], tableName);
    expect(result?.Item).toEqual({ testId: "TestItem" });
  });

  test("getItem should retrieve all attributes from an item in the DynamoDB table when no attributes are specified", async () => {
    const key = { id: "123" };
    const result = await getItem(key, undefined, tableName);
    expect(result?.Item?.testId).toEqual("TestItem");
  });

  test("getItem should populate fields from another table", async () => {
    const key = { id: "123" };
    const result = await getItem(key, undefined, "Test2Table", [
      { fieldName: "referenceId", tableName: "TestTable" },
    ]);
    expect(result?.Item?.referenceId?.testId).toEqual("TestItem");
  });
});
