import { describe, expect, it } from "vitest";
import { localeForHostname } from "../lib/domain-locale";

describe("localeForHostname", () => {
  it("uses Dutch for .nl domains", () => {
    expect(localeForHostname("plainworkstudio.nl")).toBe("nl");
    expect(localeForHostname("www.plainworkstudio.nl")).toBe("nl");
  });

  it("uses English for .online domains", () => {
    expect(localeForHostname("plainworkstudio.online")).toBe("en");
    expect(localeForHostname("www.plainworkstudio.online")).toBe("en");
  });

  it("keeps Dutch as the safe default for previews and local development", () => {
    expect(localeForHostname("localhost")).toBe("nl");
    expect(localeForHostname("plainwork-studio.vercel.app")).toBe("nl");
  });
});
