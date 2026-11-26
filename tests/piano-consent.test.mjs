import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from '/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js';
import { Buffer } from 'node:buffer';

test('Piano SDK und Events warten auf Consent; Widerruf stoppt Übermittlung', async () => {
  const old = { window: globalThis.window, document: globalThis.document, env: globalThis.__TEST_ENV__, ph: globalThis.__PH_MOCK__ };
  const listeners = new Map();
  const sent = [], modes = [];
  let scriptsLoaded = 0;
  const mockPa = {
    sendEvent: (event, properties) => sent.push({event,properties}),
    setConfigurations: () => {}, setProperties: () => {},
    consent: {setMode(mode){modes.push(mode)}}
  };
  globalThis.__PH_MOCK__ = {initPosthogTracking:()=>{},setPosthogTrackingContext:()=>{},sendToPosthog:()=>{}};
  globalThis.__TEST_ENV__ = {
    VITE_PIANO_ENABLED:'true', VITE_PIANO_SITE_ID:'123', VITE_PIANO_COLLECT_DOMAIN:'https://example.invalid',
    VITE_PIANO_ESSENTIAL_APPROVED:'false', VITE_PIANO_CUSTOM_VIDEO_EVENTS:'false', DEV:false
  };
  globalThis.window = {
    location:{href:'https://med-i.example.de/',hostname:'med-i.example.de',origin:'https://med-i.example.de',pathname:'/'},
    addEventListener(name,handler){listeners.set(name,handler)},
    pa:undefined
  };
  globalThis.document = {
    querySelector:()=>null,
    createElement:()=>({}),
    head:{appendChild(script){scriptsLoaded+=1;window.pa=mockPa;script.onload();}}
  };
  try {
    const fileUrl = new URL('../src/tracking/piano.js', import.meta.url);
    let source = fs.readFileSync(fileUrl,'utf8')
      .replace(/^import \{ initPosthogTracking, setPosthogTrackingContext, sendToPosthog \} from "\.\/posthog\.js";/m,
        'const {initPosthogTracking,setPosthogTrackingContext,sendToPosthog}=globalThis.__PH_MOCK__;')
      .replaceAll('import.meta.env','globalThis.__TEST_ENV__');
    if (fileUrl.pathname.endsWith('.ts')) source = ts.transpileModule(source,{
      compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}
    }).outputText;
    const piano = await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
    await piano.initPianoTracking({project_id:'check-consent'});
    piano.trackEvent('page.display',{page:'Home'});
    piano.trackEvent('click.action',{click:'Open module'});
    assert.equal(scriptsLoaded,0,'Kein SDK ohne Consent laden');
    assert.deepEqual(sent,[],'Keine Events vor Consent');
    const handler = listeners.get('medi:analytics-consent');
    assert.equal(typeof handler,'function');
    handler({detail:{piano:true}});
    await new Promise(resolve=>setTimeout(resolve,10));
    assert.equal(scriptsLoaded,1);
    assert.equal(window.pdl.requireConsent,'v2');
    assert.equal(window.pdl.consent.defaultPreset.PA,'opt-out');
    assert(modes.includes('opt-in'));
    assert.deepEqual(sent.map(x=>x.event),['page.display'],'Nur letzte Seite wird beim Consent nachgemeldet');
    piano.trackEvent('click.action',{click:'Accepted action'});
    assert.equal(sent.length,2);
    handler({detail:{piano:false}});
    assert.equal(modes.at(-1),'opt-out');
    piano.trackEvent('click.action',{click:'After revoke'});
    assert.equal(sent.length,2,'Nach Widerruf keine weiteren Events');
    handler({detail:{piano:true}});
    await new Promise(resolve=>setTimeout(resolve,0));
    assert.equal(modes.at(-1),'opt-in');
    assert.deepEqual(sent.slice(-1).map(x=>x.event),['page.display']);
  } finally {
    for(const key of Object.keys(old)) {
      const target = key==='env'?'__TEST_ENV__':key==='ph'?'__PH_MOCK__':key;
      if(old[key]===undefined) delete globalThis[target]; else globalThis[target]=old[key];
    }
  }
});
