import test from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
function storage(){
 const values=new Map();return {getItem:k=>values.has(k)?values.get(k):null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k),get length(){return values.size}};
}
test('Consent wird nicht implizit gewährt; erlaubt Ablehnung, spätere Zustimmung, Widerruf und Ablauf', async()=>{
 const original=globalThis.window;
 const localStorage=storage();
 const events=[];
 globalThis.window={localStorage,dispatchEvent(event){events.push(event.detail);}};
 try{
  const m=await import(pathToFileURL(resolve('src/consent/analyticsConsent.js')).href + '?isolated=' + Date.now());
  assert.equal(m.readAnalyticsConsent(),null);
  assert.equal(localStorage.length,0);
  assert.equal(events.length,0);
  m.broadcastAnalyticsConsent(null);
  assert.deepEqual(events.at(-1),{posthog:false,piano:false,source:'med-i-consent-v1'});
  m.storeAnalyticsConsent('rejected');
  assert.equal(m.readAnalyticsConsent(),'rejected');
  assert.deepEqual(events.at(-1),{posthog:false,piano:false,source:'med-i-consent-v1'});
  m.storeAnalyticsConsent('accepted');
  assert.equal(m.readAnalyticsConsent(),'accepted');
  assert.deepEqual(events.at(-1),{posthog:true,piano:true,source:'med-i-consent-v1'});
  m.storeAnalyticsConsent('rejected');
  assert.equal(m.readAnalyticsConsent(),'rejected');
  assert.deepEqual(events.at(-1),{posthog:false,piano:false,source:'med-i-consent-v1'});
  localStorage.setItem(m.CONSENT_STORAGE_KEY,JSON.stringify({version:'1',choice:'accepted',at:Date.now()-m.CONSENT_MAX_AGE_MS-1000}));
  assert.equal(m.readAnalyticsConsent(),null);
  assert.throws(()=>m.storeAnalyticsConsent('unknown'));
 }finally{ if(original === undefined) delete globalThis.window; else globalThis.window=original;}
});
