const crypto = require("crypto");
const { deterministicPartitionKey } = require(".");

describe("deterministicPartitionKey", () => {
  it('Should return the custom partitionKey when provided in the event', () => {
    const event = { 
        partitionKey: 'the-partition-key',
    };
    const expectedPartitionKey = 'the-partition-key';
    const actualPartitionKey = deterministicPartitionKey(event);
    expect(actualPartitionKey).toEqual(expectedPartitionKey);
  });
});