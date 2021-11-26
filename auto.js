let minimist = require("minimist");
let puppeteer = require("puppeteer");
let fs = require("fs");

let args = minimist(process.argv);

let configJSON = fs.readFileSync(args.config, "utf-8");
let configJSO = JSON.parse(configJSON);

async function run() {
  let browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
    defaultViewport: null,
  });

  let pages = await browser.pages();
  let page = pages[0];

  await page.goto(args.url);

  await page.waitForSelector("a[href='/login']");
  await page.click("a[href='/login']");

  await page.waitForSelector("input[type='email']");
  await page.type("input[name='email']", configJSO.userid, { delay: 20 });

  await page.waitForSelector("input[type='password']");
  await page.type("input[name='password']", configJSO.pass);

  await page.waitForSelector("button[type='submit']");
  await page.click("button[type='submit']");

  await page.waitFor(2000);

  await page.waitForSelector("a[href='https://contactout.com/search']");
  await page.click("a[href='https://contactout.com/search']");

  await page.waitForSelector("input#title-selectized");
  await page.type("input#title-selectized", configJSO.jobt);

  await page.waitFor(1000);

  await page.waitForSelector("input#location-selectized");
  await page.type("input#location-selectized", configJSO.cityN);

  await page.waitFor(1000);

  await page.waitForSelector("input#company-selectized");
  await page.type("input#company-selectized", configJSO.company);

  await page.waitFor(1000);

  await page.waitForSelector("button[type='submit']");
  await page.click("button[type='submit']");

  await page.waitFor(3000);

  const handles = await page.$$("a.btn btn-link reveal text-bold");
  for (const handle of handles) await handle.click();

  async function handleAllContestsOfAPage(page, browser) {
    await page.waitForSelector("a.btn btn-link reveal text-bold");
    let curls = await page.$$eval(
      "a.a.btn btn-link reveal text-bold",
      function (atags) {
        let urls = [];

        for (let i = 0; i < atags.length; i++) {
          let url = atags[i].getAttribute("href");
          urls.push(url);
        }

        return urls;
      }
    );

    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");

    await page.waitForSelector("p.mmT");
    await page.click("p.mmT");

    await page.waitFor(3000);

    await page.waitForSelector("li[data-tab='moderators']");
    await page.click("li[data-tab='moderators']");

    await page.waitForSelector("input#moderator");
    await page.type("input#moderator", configJSO.moderator, { delay: 50 });

    await page.keyboard.press("Enter");
  }

  run();
}
