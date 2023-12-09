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

export function findDifferingItem<Type>(
  list1: Type[],
  list2: Type[]
): any | undefined {
  const set1 = new Set(list1);
  const set2 = new Set(list2);

  for (const item of set1) {
    if (!set2.has(item)) {
      return item;
    }
  }

  for (const item of set2) {
    if (!set1.has(item)) {
      return item;
    }
  }

  return null; // If no differing item is found
}
