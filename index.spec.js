const crypto = require("crypto");
const { deterministicPartitionKey } = require("./");

describe("deterministicPartitionKey", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should return the custom partitionKey when provided in the event", () => {
    const event = {
      partitionKey: 'my-custom-candidate-key',
    };

    const expectedPartitionKey = 'my-custom-candidate-key';
    const actualPartitionKey = deterministicPartitionKey(event);
    expect(actualPartitionKey).toEqual(expectedPartitionKey);
  });

  it("Should return the hashed partitionKey when not provided in the event", () => {
    const event = {
      things: "some event things",
    };
    const expectedPartitionKey = "hash in the event 'things' prop";
  
    const updateMock = jest.fn().mockReturnThis();
    const digestMock = jest.fn().mockReturnValue(expectedPartitionKey);
  
    jest.spyOn(crypto, "createHash").mockReturnValue({
      update: updateMock,
      digest: digestMock,
    });
  
    const actualPartitionKey = deterministicPartitionKey(event);
  
    expect(actualPartitionKey).toEqual(expectedPartitionKey);
    expect(crypto.createHash).toHaveBeenCalledWith("sha3-512");
    expect(updateMock).toHaveBeenCalledWith(JSON.stringify(event));
    expect(digestMock).toHaveBeenCalled();
  });

  it("Should return trivial partitionKey when event is null", () => {
    const event = null;
    const expectedPartitionKey = "0";

    const actualPartitionKey = deterministicPartitionKey(event);
    expect(actualPartitionKey).toEqual(expectedPartitionKey);
  });

  it("Should convert the partitionKey to a `string` when it is NOT a `string`", () => {
    const event = {
      partitionKey: 123456789,
    };
    const expectedPartitionKey = "123456789";
    const actualPartitionKey = deterministicPartitionKey(event);
  
    expect(actualPartitionKey).toEqual(expectedPartitionKey);
  });

  it("Should hash the partitionKey when its length is greater than the maximum allowed length", () => {
    const longPartitionKey = "a".repeat(257);
    const event = {
      partitionKey: longPartitionKey,
    };
    const expectedPartitionKey = "partition-key-hash";
  
    const updateMock = jest.fn().mockReturnThis();
    const digestMock = jest.fn().mockReturnValue(expectedPartitionKey);
  
    jest.spyOn(crypto, "createHash").mockReturnValue({
      update: updateMock,
      digest: digestMock,
    });
  
    const actualPartitionKey = deterministicPartitionKey(event);
  
    expect(actualPartitionKey).toEqual(expectedPartitionKey);
    expect(crypto.createHash).toHaveBeenCalledWith("sha3-512");
    expect(updateMock).toHaveBeenCalledWith(longPartitionKey);
    expect(digestMock).toHaveBeenCalled();
  });
});