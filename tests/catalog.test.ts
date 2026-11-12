import { describe, expect, it } from "vitest";
import { catalog } from "../lib/catalog";

describe("starter catalog", () => {
  it("links every product to one unique free PDF and paid ZIP", () => {
    expect(catalog).toHaveLength(10);
    expect(new Set(catalog.map((item) => item.key)).size).toBe(catalog.length);

    for (const item of catalog) {
      expect(item.free.file).toMatch(/^[0-9]{2}_[A-Za-z0-9_]+\.pdf$/);
      expect(item.paid.archive).toMatch(/^[0-9]{2}_[A-Za-z0-9_]+\.zip$/);
    }
  });
});
