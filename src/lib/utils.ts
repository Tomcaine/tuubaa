import { log } from "console";

export async function delay(ms: number) {
  try {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  } catch (e) {
    log(e);
  }
}

// if value is undefined, return null
export function check<T>(value: T): T | null {
  return value || null;
}