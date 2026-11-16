import { describe, expect, it } from "vitest";
import { localeForHostname,currencyForHostname } from "../lib/domain-locale";

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

describe("currencyForHostname",()=>{
 it("defaults .nl to euro",()=>{
  expect(currencyForHostname("plainworkstudio.nl")).toBe("EUR");
  expect(currencyForHostname("www.plainworkstudio.nl")).toBe("EUR");
 });
 it("defaults .online to pounds",()=>{
  expect(currencyForHostname("plainworkstudio.online")).toBe("GBP");
  expect(currencyForHostname("www.plainworkstudio.online")).toBe("GBP");
  expect(currencyForHostname("PLAINWORKSTUDIO.ONLINE.")).toBe("GBP");
 });
 it("keeps unknown and preview hosts in EUR",()=>{
  expect(currencyForHostname("localhost")).toBe("EUR");
  expect(currencyForHostname("plainwork-studio.vercel.app")).toBe("EUR");
  expect(currencyForHostname("notplainworkstudio.online")).toBe("EUR");
 });
});
