import { queryItems } from "../index";

describe("DynamoDB Query Items", () => {
  const tableName = "TestTable";

  test("queryItem should perform a query in the DynamoDB table", async () => {
    const queryObject = { searchId: "testSearch" };
    const result = await queryItems(queryObject, tableName);

    expect(result).toHaveProperty("Items");
    expect(result?.Items?.length).toBeGreaterThan(-1);
  });
  test("queryItems should retrieve specific attributes from items in the DynamoDB table", async () => {
    const queryObject = { searchId: "testSearch" };
    const result = await queryItems(
      queryObject,
      tableName,
      undefined,
      undefined,
      "testId"
    );
    expect(result?.Items?.[0]?.testId).toEqual("TestItem");
  });

  test("queryItems should paginate results", async () => {
    const queryObject = { searchId: "testSearch" };
    const result1 = await queryItems(queryObject, tableName, "1");
    const result2 = await queryItems(
      queryObject,
      tableName,
      "1",
      result1?.LastEvaluatedKey?.toString()
    );
    expect(result1?.Items?.length).toEqual(1);
    expect(result2?.Items?.length).toEqual(1);
    expect(result1?.Items?.[0]?.id).not.toEqual(result2?.Items?.[0]?.id);
  });

  test("queryItems should populate fields from another table", async () => {
    const queryObject = { searchId: "testSearch" };
    const populateParams = [
      {
        fieldName: "referenceId",
        tableName: "Test2Table",
        attributes: ["testId"],
      },
    ];
    const result = await queryItems(
      queryObject,
      tableName,
      undefined,
      undefined,
      undefined,
      populateParams
    );
    expect(result?.Items?.[0]?.referenceId?.testId).toEqual("TestItem");
  });

  test("queryItems should filter items based on populateFilter", async () => {
    const queryObject = { searchId: "testSearch" };
    const populateParams = [
      {
        fieldName: "referenceId",
        tableName: "Test2Table",
        attributes: ["testId"],
      },
    ];
    const populateFilter = [
      { fieldName: "referenceId", filter: { testId: "TestItem" } },
    ];
    const result = await queryItems(
      queryObject,
      tableName,
      undefined,
      undefined,
      undefined,
      populateParams,
      populateFilter
    );
    expect(result?.Items?.[0]?.referenceId?.testId).toEqual("TestItem");
  });
});
