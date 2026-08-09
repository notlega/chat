import { describe, expect, test } from "vitest";
import { cn, mergeDedupeSort } from "@/lib/utils";

describe("cn", () => {
  test("should dedupe classes successfully", () => {
    const result = cn("m-2 p-2", "p-2");

    expect(result).toBe("m-2 p-2");
  });
});

describe("mergeDedupeSort", () => {
  test("should merge, dedupe, and sort all objects by asc", () => {
    const result = mergeDedupeSort(
      [
        { id: "1", value: 3 },
        { id: "2", value: 1 },
        { id: "3", value: 2 },
        { id: "5", value: 4 },
      ],
      [
        { id: "4", value: 6 },
        { id: "5", value: 4 },
        { id: "6", value: 5 },
        { id: "1", value: 3 },
      ],
      (item) => item.id,
      (item) => item.value,
      "asc",
    );

    expect(result).toEqual([
      { id: "2", value: 1 },
      { id: "3", value: 2 },
      { id: "1", value: 3 },
      { id: "5", value: 4 },
      { id: "6", value: 5 },
      { id: "4", value: 6 },
    ]);
  });

  test("should merge, dedupe, and sort all objects by desc", () => {
    const result = mergeDedupeSort(
      [
        { id: "1", value: 3 },
        { id: "2", value: 1 },
        { id: "3", value: 2 },
        { id: "5", value: 4 },
      ],
      [
        { id: "4", value: 6 },
        { id: "5", value: 4 },
        { id: "6", value: 5 },
        { id: "1", value: 3 },
      ],
      (item) => item.id,
      (item) => item.value,
      "desc",
    );

    expect(result).toEqual([
      { id: "4", value: 6 },
      { id: "6", value: 5 },
      { id: "5", value: 4 },
      { id: "1", value: 3 },
      { id: "3", value: 2 },
      { id: "2", value: 1 },
    ]);
  });
});
