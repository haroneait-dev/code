const path=require("node:path");
process.chdir(path.resolve(__dirname,".."));
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs');
(async()=>{
 const phase=process.argv[2]||'avant';
 const browser=await chromium.launch({...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {}),headless:true});
 const routes=['/','/claude','/claude-code','/learn','/learn/intro/chatting-vs-delegating','/wiki','/wiki/claude-bases/bien-demander','/fiches','/applications','/prompts','/test','/evolution','/choisir-modele','/patch-notes'];
 if(phase==='apres')routes.push('/learn/intro','/learn/api','/experience');
 const dir=`docs/captures/${phase}`;fs.mkdirSync(dir,{recursive:true});const results=[];
 for(const width of [390,1440]) for(const theme of ['light','dark']) {
  const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme,reducedMotion:'reduce'});
  await context.addInitScript(t=>localStorage.setItem('theme',t),theme);
  const page=await context.newPage();
  for(const route of routes){
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto((process.env.QA_BASE_URL || 'http://127.0.0.1:3000')+route,{waitUntil:'networkidle',timeout:120000});
   await page.evaluate(async()=>{await document.fonts.ready;});
   const measurements=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,width:document.documentElement.scrollWidth,h1:[...document.querySelectorAll('h1')].map(el=>({text:el.textContent,size:getComputedStyle(el).fontSize})),offenders:[...document.querySelectorAll('main *')].filter(el=>el.getBoundingClientRect().right>innerWidth+1).slice(0,8).map(el=>({tag:el.tagName,class:el.className}))}));
   const tall=await page.evaluate(()=>document.documentElement.scrollHeight>=65000);
   const file=`${route==='/'?'accueil':route.slice(1).replaceAll('/','-')}-${width}-${theme}.${tall?'png':'jpg'}`;
   await page.screenshot({path:`${dir}/${file}`,fullPage:true,...(tall?{type:'png'}:{type:'jpeg',quality:55})});
   if(fs.statSync(`${dir}/${file}`).size===0)throw Error('Capture vide : '+file);
   results.push({route,width,theme,status:response.status(),...measurements,errors,file});
   console.log(`${phase} ${width} ${theme} ${route} ${response.status()} overflow=${measurements.overflow}`);
  }
  await context.close();
 }
 fs.writeFileSync(`${dir}/mesures.json`,JSON.stringify(results,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
