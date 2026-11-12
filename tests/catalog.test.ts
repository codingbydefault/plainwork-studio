import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { catalog } from "../lib/catalog";

describe("starter catalog", () => {
  it("links every product to one unique free PDF and paid ZIP", () => {
    expect(catalog).toHaveLength(10);
    expect(new Set(catalog.map((item) => item.key)).size).toBe(catalog.length);

    for (const item of catalog) {
      expect(existsSync(resolve("public/free-guides", item.free.file))).toBe(true);
      expect(existsSync(resolve("secure-product-files", item.paid.archive))).toBe(true);
    }
  });
});
