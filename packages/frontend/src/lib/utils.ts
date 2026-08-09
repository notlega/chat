import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mergeDedupeSort<T>(
  current: T[],
  incoming: T[],
  compare: (item: T) => string,
  value: (item: T) => string | number | Date,
  direction: "asc" | "desc" = "desc",
): T[] {
  const seen = new Set<string>();
  const merged = [...current, ...incoming].filter((item) => {
    const itemId = compare(item);

    if (seen.has(itemId)) {
      return false;
    }

    seen.add(itemId);
    return true;
  });

  const dir = direction === "asc" ? 1 : -1;
  const sorted = merged.sort((a, b) => {
    const currentValue = value(a);
    const incomingValue = value(b);
    if (currentValue < incomingValue) return -dir;
    if (currentValue > incomingValue) return dir;
    return 0;
  });

  return sorted;
}
