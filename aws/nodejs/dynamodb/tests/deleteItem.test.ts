import { deleteItem, getItem } from "../index";

describe("DynamoDB Delete Item ", () => {
  const tableName = "TestTable";

  test("deleteItem should delete an item from the DynamoDB table", async () => {
    const key = { id: "123" };

    const result = await deleteItem(key, tableName);
    expect(result).toBeDefined();

    const getResult = await getItem(key, undefined, tableName);
    expect(getResult.Item).toBeUndefined();
  });
});
