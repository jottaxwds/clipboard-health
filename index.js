const crypto = require("crypto");

function createHashPartitionKey (data) {
    return crypto.createHash("sha3-512").update(data).digest("hex")
}

function getHashPartitionKeyFromEvent (event) {
    const data = JSON.stringify(event);
    return createHashPartitionKey(data);
}

function getPartitionKeyFromEvent (event) {
    if (!event) {
        return null;
    }

    if (event.partitionKey) {
        return event.partitionKey;
    } 

    return getHashPartitionKeyFromEvent(event);    
}

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  const candidate = getPartitionKeyFromEvent(event);

  if (!candidate) {
    return TRIVIAL_PARTITION_KEY;
  }

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    return createHashPartitionKey(candidate);
  }

  if (typeof candidate !== "string") {
    return JSON.stringify(candidate);
  }

  return candidate;
};