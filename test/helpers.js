const autoconsent = require("../dist/autoconsent.puppet");
const ruleConfig = require("../rules/rules.json");
const { ConsentOMaticCMP, Tab, createAutoCMP, waitFor } = autoconsent;

const rules = [...autoconsent.rules];
// Object.keys(ruleConfig.consentomatic).forEach((name) => {
//   rules.push(new ConsentOMaticCMP(`com_${name}`, ruleConfig.consentomatic[name]));
// })
ruleConfig.autoconsent.forEach((rule) => rules.push(createAutoCMP(rule)));

async function getTab(page) {
  let id = 1;
  const frames = {
    0: await page.mainFrame(),
  };
  const tab = new Tab(page, await page.url(), frames);
  const addFrame = async (frame) => {
    const f = {
      id: ++id,
      url: await frame.url(),
    };
    // console.log('check frame', f.url);
    frames[f.id] = frame;
    const frameMatch = rules.findIndex((r) => r.detectFrame(tab, f));
    if (frameMatch > -1) {
      tab.frame = {
        type: rules[frameMatch].name,
        url: f.url,
        id: f.id,
      };
    }
  };
  await Promise.all((await page.frames()).map(addFrame));
  page.on("frameattached", addFrame);
  page.on("framenavigated", addFrame);
  return tab;
}

async function detectDialog(tab, retries = 2) {
  const detect = await Promise.all(rules.map((r) => r.detectCmp(tab)));
  const found = detect.findIndex((r) => r);
  if (found === -1 && retries > 0) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = detectDialog(tab, retries - 1);
        resolve(result);
      }, 1000);
    });
  }
  return found > -1 ? rules[found] : null;
}

async function testCmpOptOut(
  cmpName,
  url,
  browser,
  { screenshot } = { screenshot: false }
) {
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  const tab = await getTab(page);
  const rule = await detectDialog(tab, 5);
  expect(rule.name).toBe(cmpName);
  expect(await rule.detectPopup(tab)).toBeTruthy();
  expect(await rule.optOut(tab)).not.toBeFalsy();
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (screenshot) {
    await page.screenshot({
      path: `./test/screenshots/${cmpName}_${new URL(url).hostname}.png`,
    })
  }

  expect(await rule.test(tab)).toBeTruthy();
  await page.close();
}

module.exports = {
  getTab,
  detectDialog,
  testCmpOptOut,
};
