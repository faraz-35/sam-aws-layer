import { scanItems } from "../index";
import { PopulateParam } from "../../types";

describe("DynamoDB Scan Items", () => {
  const tableName = "TestTable";

  test("scanItems should retrieve limited items from the DynamoDB table", async () => {
    const result = await scanItems(1, undefined, undefined, tableName);

    expect(result?.Items).toBeDefined();
    expect(result?.Items?.length).toBe(1);
  });

  test("scanItems should retrieve items from the DynamoDB table starting from the exclusiveStartKey", async () => {
    const firstResult = await scanItems(1, undefined, undefined, tableName);
    const secondResult = await scanItems(
      1,
      firstResult?.Items?.[0].id,
      undefined,
      tableName
    );

    expect(secondResult?.Items).toBeDefined();
    expect(secondResult?.Items?.length).toBe(1);
    expect(secondResult?.Items?.[0].id).not.toBe(firstResult?.Items?.[0].id);
  });

  test("scanItems should retrieve items with specific attributes from the DynamoDB table", async () => {
    const result = await scanItems(
      undefined,
      undefined,
      "id,testId",
      tableName
    );

    expect(result?.Items).toBeDefined();
    result?.Items?.forEach((item) => {
      expect(Object.keys(item)).toEqual(
        expect.arrayContaining(["id", "testId"])
      );
    });
  });

  test("scanItems should retrieve items that match the filter from the DynamoDB table", async () => {
    const filter = { testId: "TestItem" };
    const result = await scanItems(
      undefined,
      undefined,
      undefined,
      tableName,
      filter
    );

    expect(result?.Items).toBeDefined();
    result?.Items?.forEach((item) => {
      expect(item.testId).toBe(filter.testId);
    });
  });

  test("scanItems should populate fields from another table", async () => {
    const populate: PopulateParam[] = [
      {
        fieldName: "testId",
        tableName: "Test2Table",
        attributes: ["id", "referenceId"],
      },
    ];
    const result = await scanItems(
      undefined,
      undefined,
      undefined,
      tableName,
      undefined,
      populate
    );

    expect(result?.Items).toBeDefined();
    result?.Items?.forEach((item) => {
      expect(item.testId).toHaveProperty("id");
      expect(item.testId).toHaveProperty("referenceId");
    });
  });

  test("scanItems should filter items based on the populateFilter", async () => {
    const populate: PopulateParam[] = [
      {
        fieldName: "testId",
        tableName: "Test2Table",
        attributes: ["id", "referenceId"],
      },
    ];
    const populateFilter = [{ fieldName: "testId", filter: { id: "123" } }];
    const result = await scanItems(
      undefined,
      undefined,
      undefined,
      tableName,
      undefined,
      populate,
      populateFilter
    );

    expect(result?.Items).toBeDefined();
    result?.Items?.forEach((item) => {
      expect(item.testId.id).toBe(populateFilter[0].filter.id);
    });
  });
});
