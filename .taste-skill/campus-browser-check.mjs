import { Browser, sleep } from '../.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const out='.taste-skill/campus-qa';mkdirSync(out,{recursive:true});
const browser=await Browser.launch();const results=[];
const base=process.env.QA_URL||'http://localhost:3000';
const click=async(page,text)=>{const found=await page.eval((text)=>{const button=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===text || b.getAttribute('aria-label')===text);if(!button)return false;button.click();return true;},text);assert.ok(found,'Button '+text);await sleep(180);};
const setInput=async(page,selector,value)=>page.eval(({selector,value})=>{const input=document.querySelector(selector);Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));},{selector,value});
try{
 const page=await browser.newPage({width:1440,height:900});
 await page.goto(base+'/welcome');
 await click(page,'Continue as guest');assert.equal(await page.eval(()=>location.pathname),'/home');
 assert.ok(await page.eval(()=>!!document.querySelector('.assistant-panel')));results.push('Guest entry reaches redesigned home');
 await click(page,'See my next step');assert.equal(await page.eval(()=>location.pathname),'/admissions/checklist');results.push('Next step reaches real admissions checklist');
 await page.goto(base+'/programs');
 const initialCount=await page.eval(()=>document.querySelectorAll('.programme-results > .row-link').length);
 await setInput(page,'input[type=search]','computer');await sleep(300);
 const filtered=await page.eval(()=>[...document.querySelectorAll('.programme-results > .row-link')].map(e=>e.textContent));assert.ok(filtered.length>0&&filtered.length<initialCount);assert.ok(filtered.every(x=>/computer/i.test(x)));results.push('Programme search filters actual records');
 const savedName=await page.eval(()=>{const b=document.querySelector('button[aria-label^="Save "]');const name=b.getAttribute('aria-label').slice(5);b.click();return name;});await sleep(200);
 await page.goto(base+'/saved');assert.ok(await page.eval(name=>document.body.textContent.includes(name),savedName));results.push('Saved programme persists after navigation and reload');
 await page.goto(base+'/programs');await click(page,'Postgraduate');assert.ok(await page.eval(()=>document.querySelector('button[aria-pressed=true]').textContent.includes('Postgraduate')));await click(page,'Compare programmes');assert.equal(await page.eval(()=>location.pathname),'/program-comparison');results.push('Programme level and comparison controls work');
 await page.goto(base+'/home');
 await click(page,'Switch to French');assert.ok(await page.eval(()=>document.body.textContent.includes('Trouvez votre voie')));await click(page,'Passer en anglais');results.push('Home switches between English and French');
 // Intercept the test request inside this throwaway browser: no AI provider call.
 let requests=0;
 const off=browser.on(page.sessionId,'Fetch.requestPaused',async(event)=>{requests++;await sleep(450);await page.send('Fetch.fulfillRequest',{requestId:event.requestId,responseCode:503,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from(JSON.stringify({error:'Visual QA: service temporarily unavailable'})).toString('base64')});});
 await page.send('Fetch.enable',{patterns:[{urlPattern:'*/api/chat',requestStage:'Request'}]});
 await setInput(page,'input[aria-label="Your question"]','How do I apply?');await click(page,'Send message');
 assert.ok(await page.eval(()=>document.body.textContent.includes('Checking the university knowledge base')));for(let i=0;i<25;i++){if(await page.eval(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='Retry')))break;await sleep(400);}
 assert.ok(await page.eval(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='Retry')));
 const initialRequests=requests;await click(page,'Retry');await sleep(900);assert.ok(requests>initialRequests);results.push('Chat pending, error and retry work with intercepted test responses');off();await page.send('Fetch.disable');
 assert.equal(page.consoleErrors.length,0,JSON.stringify(page.consoleErrors));
 const routes=['/welcome','/home','/chat','/programs','/admissions','/fees','/academic-calendar','/saved','/profile'];
 for(const width of [1440,768,390]){
   await page.setViewport({width,height:width===390?844:900});
   for(const route of routes){
     await page.goto(base+route,{settleMs:550});
     const metrics=await page.eval(()=>({h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth-innerWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));
     assert.equal(metrics.h1,1,route+' h1 at '+width);assert.ok(metrics.overflow<=1,route+' overflow at '+width);assert.equal(metrics.broken.length,0,route+' broken images');
     if(['/welcome','/home','/programs'].includes(route))await page.screenshot({path:out+'/'+route.slice(1)+'-'+width+'.jpg'});
   }
 }
 results.push('Nine routes at 1440, 768 and 390: one h1, no overflow or broken images');
 const reduced=await browser.newPage({width:390,height:844,reducedMotion:true});await reduced.goto(base+'/welcome');assert.equal(await reduced.eval(()=>document.querySelectorAll('video').length),0);assert.ok(await reduced.eval(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='Continue as guest')));results.push('Reduced motion loads a still illustration and keeps primary action available');
 await page.goto(base+'/home');
 await page.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await page.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 assert.equal(await page.eval(()=>document.activeElement.textContent.trim()),'Skip to content');results.push('Keyboard skip link receives first focus');
 assert.equal(page.consoleErrors.length,0,JSON.stringify(page.consoleErrors));
 writeFileSync(out+'/results.json',JSON.stringify({base,checks:results},null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
