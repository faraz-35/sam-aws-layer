test_table_definition='{
  "TableName": "TestTable",
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "S" },
    { "AttributeName": "searchId", "AttributeType": "S" }
  ],
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "BillingMode": "PAY_PER_REQUEST",
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "searchId",
      "KeySchema": [
        { "AttributeName": "searchId", "KeyType": "HASH" }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ]
}'
test2_table_definition='{
  "TableName": "Test2Table",
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "S" },
    { "AttributeName": "searchId", "AttributeType": "S" }
  ],
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "BillingMode": "PAY_PER_REQUEST",
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "searchId",
      "KeySchema": [
        { "AttributeName": "searchId", "KeyType": "HASH" }
      ],
      "Projection": {
        "ProjectionType": "ALL"
      }
    }
  ]
}'

# Create DynamoDB table
aws dynamodb create-table --cli-input-json "$test_table_definition" --endpoint-url http://localhost:8000 > /dev/null
aws dynamodb create-table --cli-input-json "$test2_table_definition" --endpoint-url http://localhost:8000 > /dev/null