const { firefox } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
process.chdir(root);
fs.mkdirSync('artifacts', { recursive: true });
(async () => {
 const browser = await firefox.launch({headless:true});
 const page = await browser.newPage({ viewport:{width:390,height:844},deviceScaleFactor:1 });
 await page.route('http://grab-preview.test/**', async route => {
  const fs = require('node:fs');
  const path = require('node:path');
  const pathname = new URL(route.request().url()).pathname;
  const target = path.join(path.join(root, 'dist'), pathname === '/' ? 'index.html' : pathname);
  const contentType = target.endsWith('.js') ? 'text/javascript' : target.endsWith('.css') ? 'text/css' : target.endsWith('.svg') ? 'image/svg+xml' : 'text/html';
  await route.fulfill({status:200,contentType,body:fs.readFileSync(target)});
 });
 const errors=[]; page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://grab-preview.test/');
 await page.screenshot({path:'artifacts/home-390.png'});
 const homeFit = await page.evaluate(() => document.querySelector('.shortcut.learn').getBoundingClientRect().bottom <= document.querySelector('.bottom-nav').getBoundingClientRect().top);
 assert.ok(homeFit, 'Learn to Earn must remain visible above the Home footer');
 await page.getByRole('button',{name:'Learn to Earn',exact:true}).click();
 await page.screenshot({path:'artifacts/learn-390.png'});
 for(const [width,height] of [[390,844],[375,667],[360,640],[320,568],[430,932],[1440,1000]]) {
  await page.setViewportSize({width,height});
  await page.goto('http://grab-preview.test/#learn-to-earn');
  await page.waitForTimeout(100);
  const layout=await page.evaluate(()=>({width:innerWidth,height:innerHeight,documentWidth:document.documentElement.scrollWidth,feesBottom:document.querySelector('.fees-link').getBoundingClientRect().bottom,footerTop:document.querySelector('.bottom-nav').getBoundingClientRect().top,firstBottom:document.querySelector('.learn-first').getBoundingClientRect().bottom}));
  console.log(JSON.stringify(layout));
  assert.ok(layout.documentWidth <= width, 'No horizontal overflow');
  assert.ok(layout.feesBottom <= layout.footerTop, 'Offer and fee link must fit above the footer');
  if(width===375||width===320) await page.screenshot({path:`artifacts/learn-${width}.png`});
 }
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'View and activate discounts',exact:true}).click();
 await page.getByRole('button',{name:'Activate discounts',exact:true}).click();
 if(!await page.getByRole('button',{name:'Discounts activated'}).isDisabled()) throw new Error('Activation not reflected');
 await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('button',{name:'View fees after your promotion ends',exact:true}).click();
 await page.getByRole('heading',{name:'After your promotion ends'}).waitFor();
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Review and publish',exact:true}).click();
 await page.getByLabel('Suggested description').fill('Stir-fried chicken with Thai holy basil, served with steamed rice. Choose your spice level. Freshly cooked to order.');
 await page.getByRole('button',{name:'Publish update',exact:true}).click();
 await page.getByText('Submitted for review',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Close dialog'}).click();
 await page.waitForTimeout(4300);
 await page.locator('#next-improvement').scrollIntoViewIfNeeded();
 await page.screenshot({path:'artifacts/improvement-390.png'});
 await page.getByRole('tab',{name:'Your results',exact:true}).click();
 await page.getByText('Update awaiting review',{exact:true}).waitFor();
 await page.reload();
 await page.getByRole('button',{name:'View your active discounts'}).waitFor();
 await page.getByRole('button',{name:'View submitted update'}).click();
 assert.equal(await page.getByLabel('Suggested description').inputValue(), 'Stir-fried chicken with Thai holy basil, served with steamed rice. Choose your spice level. Freshly cooked to order.');
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Back to Home'}).click();
 await page.getByRole('heading',{name:'GrabFood Aroijung'}).waitFor();
 if(errors.length) throw new Error(errors.join('\n'));
 console.log('PASS: activation, fee details, review submission, results, persistence, navigation; no browser errors.');
 // Firefox can wait indefinitely for process cleanup in restricted containers.
 // All assertions have completed; bound teardown before ending this one-shot check.
 await Promise.race([browser.close(), new Promise(resolve => setTimeout(resolve, 3000))]);
 process.exit(0);
})().catch(error=>{console.error(error);process.exit(1)});
