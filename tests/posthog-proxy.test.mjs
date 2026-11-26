import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Vercel same-origin PostHog proxy routes only capture to EU Cloud", () => {
  const data = JSON.parse(fs.readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.deepEqual(data.rewrites, [{ source: "/_medi/r", destination: "https://eu.i.posthog.com/i/v0/e/" }]);
  const source = fs.readFileSync(new URL("../src/tracking/posthog.js", import.meta.url), "utf8");
  assert.match(source, /const endpoint = "\/_medi\/r";/);
  assert.match(source, /if \(!allowed \|\| !enabled \|\| !validToken/);
  assert.match(source, /credentials: "omit"/);
});
