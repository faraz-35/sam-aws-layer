import { putItem } from "../index";

describe("DynamoDB Put Item", () => {
  const tableName = "TestTable";

  test("putItem should add an item to the DynamoDB table", async () => {
    const item = {
      id: "123",
      testId: "TestItem",
      testArray: [],
      searchId: "testSearch",
    };
    const result = await putItem(item, tableName);
    expect(result).toBeDefined();

    const item2 = {
      id: "456",
      testId: "TestItem2",
      referenceId: item.id,
    };
    const result2 = await putItem(item2, "Test2Table");
    expect(result2).toBeDefined();
  });
});
