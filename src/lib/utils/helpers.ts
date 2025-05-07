import { getExceptionMessage } from "./withExceptionFilter";

export function parseJSON<T>(
  jsonString: string,
  fallbackValue: T | null = null
): T | null {
  try {
    if (
      typeof jsonString !== "string" ||
      jsonString.trim() === "" ||
      !jsonString
    ) {
      throw new Error("Invalid JSON string provided");
    }
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing JSON:", getExceptionMessage(error));
    return fallbackValue;
  }
}
