import mongoose from "mongoose";

// Recursively converts ObjectIds, Dates, and Decimal128 into plain
// JSON-safe values so nothing breaks when crossing the IPC boundary.
export function serialize(data) {
  if (data === null || data === undefined) return data;

  if (data instanceof mongoose.Types.ObjectId) {
    return data.toString();
  }

  if (data instanceof mongoose.Types.Decimal128) {
    return data.toString();
  }

  if (data instanceof Date) {
    return data.toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(serialize);
  }

  if (typeof data === "object") {
    const result = {};
    for (const key in data) {
      result[key] = serialize(data[key]);
    }
    return result;
  }

  return data; // strings, numbers, booleans pass through untouched
}
