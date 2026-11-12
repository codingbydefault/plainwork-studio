import {describe,expect,it} from "vitest";
import {applicationFee} from "../lib/fees";
describe("applicationFee",()=>{it("rounds exactly 1% in integer minor units",()=>{expect(applicationFee(10000)).toBe(100);expect(applicationFee(1499)).toBe(15);expect(applicationFee(50)).toBe(1);expect(applicationFee(49)).toBe(0)});it("rejects invalid amounts",()=>{expect(()=>applicationFee(-1)).toThrow();expect(()=>applicationFee(1.2)).toThrow()})});
