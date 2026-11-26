import test from "node:test";
import assert from "node:assert/strict";
import { getStandaloneMode } from "../src/tracking/displayMode.js";

test("normaler Browser-Tab ist kein Standalone-Modus", () => {
  assert.equal(getStandaloneMode({matchMedia:()=>({matches:false}),navigator:{standalone:false}}),false);
});
test("iOS Home-Bildschirm Standalone", () => {
  assert.equal(getStandaloneMode({matchMedia:()=>({matches:false}),navigator:{standalone:true}}),true);
});
test("Display-Mode standalone über CSS Media Query", () => {
  assert.equal(getStandaloneMode({matchMedia:()=>({matches:true}),navigator:{standalone:false}}),true);
});
test("fehlende APIs werden sicher behandelt", () => {
  assert.equal(getStandaloneMode({navigator:{}}),false);
});
