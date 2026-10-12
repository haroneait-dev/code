const path=require("node:path");
process.chdir(path.resolve(__dirname,".."));
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,filename);
const {curriculum}=require('../lib/curriculum.ts');
(async()=>{
 const browser=await chromium.launch({...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {}),headless:true});
 const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});
 const page=await context.newPage();const errors=[];const requests=[];
 page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(request.method()==='POST')requests.push({url:request.url(),body:request.postData()});});
 const goto=async route=>{await page.goto((process.env.QA_BASE_URL || 'http://127.0.0.1:3000')+route,{waitUntil:'load',timeout:60000});await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});};
 await goto('/learn');
 const ld=await page.locator('script[type="application/ld+json"]').first().textContent();assert.equal(JSON.parse(ld)['@type'],'Course');
 await page.getByLabel('Filtrer par niveau').selectOption('débutant');
 assert.equal(await page.locator('main ol > li').count(),curriculum.filter(m=>m.level==='débutant').length);
 await page.getByRole('link',{name:'Introduction',exact:true}).click();
 await page.getByRole('heading',{name:'Les leçons',exact:true}).waitFor();
 await page.locator('main ol li a').first().click();
 await page.getByLabel('Leçon terminée',{exact:true}).check();
 assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('cm-lecons-terminees')))).includes(curriculum[0].lessons[0].id));
 await page.reload({waitUntil:'load',timeout:60000});assert(await page.getByLabel('Leçon terminée',{exact:true}).isChecked());
 const quiz=page.locator('section').filter({has:page.getByRole('heading',{name:'Avez-vous bien compris ?',exact:true})});
 for(const [index,question]of curriculum[0].lessons[0].quiz.entries())await quiz.locator('ol > li').nth(index).getByRole('button',{name:question.options[question.answer],exact:true}).click();
 await quiz.getByText('Parfait, vous maîtrisez le sujet.').waitFor();
 assert(!requests.some(r=>r.body?.includes('quiz_article')||r.body?.includes('cm-lecons-terminees')));
 await page.getByRole('button',{name:'Ouvrir le menu'}).click();
 assert.equal(await page.locator(':focus').getAttribute('aria-label'),'Fermer le menu');
 await page.keyboard.press('Shift+Tab');assert.equal((await page.locator(':focus').textContent()).trim(),'Test de niveau (2 min)');
 await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('aria-label'),'Fermer le menu');
 await page.keyboard.press('Escape');assert.equal(await page.locator(':focus').getAttribute('aria-label'),'Ouvrir le menu');
 await goto('/learn/intro');assert((await page.locator('main').textContent()).includes(`1 / ${curriculum[0].lessons.length} leçons terminées`));
 await goto('/learn');assert((await page.locator('main').textContent()).includes(`1 / ${curriculum.flatMap(m=>m.lessons).length} leçons terminées`));
 const titles=new Set();const checked=[];const entries=curriculum.flatMap(module=>module.lessons.map(lesson=>({id:lesson.id,href:`/learn/${module.id}/${lesson.id}`})));
 for(const theme of ['light','dark']){
  await page.evaluate(theme=>{localStorage.setItem('theme',theme);document.documentElement.classList.toggle('dark',theme==='dark')},theme);
  for(const module of curriculum){
   await goto('/learn/'+module.id);assert.equal(await page.getByRole('heading',{name:'Projet de fin de module',exact:true}).count(),1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Module overflow '+module.id);
   for(const lesson of module.lessons){
    const route=`/learn/${module.id}/${lesson.id}`;await goto(route);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Lesson overflow '+route);
    const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
    assert.equal(schema['@type'],'LearningResource');assert.equal(schema.timeRequired,`PT${lesson.minutes}M`);
    assert.equal(await page.getByRole('heading',{name:'À retenir',exact:true}).count(),1);
    if(theme==='light'){const title=await page.title();assert(!titles.has(title),'Titre dupliqué '+title);titles.add(title);}
    const position=entries.findIndex(entry=>entry.id===lesson.id);
    const next=page.locator('main a').filter({hasText:/^\s*Suivant/});
    if(position<entries.length-1)assert.equal(await next.getAttribute('href'),entries[position+1].href);else assert.equal(await next.count(),0);
    checked.push({route,theme,status:'ok'});
   }
  }
 }
 await page.evaluate(()=>localStorage.setItem('cm-lecons-terminees','{"invalid":true}'));await goto('/learn');assert((await page.locator('main').textContent()).includes(`0 / ${curriculum.flatMap(m=>m.lessons).length} leçons terminées`));
 const blocked=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});
 await blocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error('blocked')};Storage.prototype.setItem=()=>{throw new Error('blocked')};});
 const blockedPage=await blocked.newPage();await blockedPage.goto((process.env.QA_BASE_URL || 'http://127.0.0.1:3000')+'/learn/intro/chatting-vs-delegating',{waitUntil:'load',timeout:60000});
 await blockedPage.getByLabel('Leçon terminée',{exact:true}).check();assert(await blockedPage.getByLabel('Leçon terminée',{exact:true}).isChecked());await blockedPage.getByRole('status').filter({hasText:'stockage est indisponible'}).waitFor();
 assert.deepEqual(errors,[]);
 const result={date:'2026-10-12',viewport:390,checked,modules:curriculum.length,uniqueTitles:titles.size,checks:['Filtre par niveau','Parcours module → leçon','Persistance et compteurs après rechargement','Quiz corrigé sans événement analytique','Menu clavier : focus, boucle et Échap','Stockage invalide et stockage refusé','Métadonnées uniques et JSON-LD de chaque leçon','Largeur des 49 leçons et 14 modules en clair et sombre','Navigation suivante conforme au parcours conseillé'],errors};
 fs.writeFileSync('docs/captures/verification-fonctionnelle.json',JSON.stringify(result,null,2));
 console.log(`Vérification réussie : ${checked.length} visites de leçon, ${curriculum.length*2} visites de module, ${titles.size} titres uniques, aucun débordement ni erreur JavaScript.`);
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
