// node script.js --url="https://www.hackerrank.com" --config="config.json"

const minimist = require("minimist");
const fs = require("fs");
const puppeteer = require("puppeteer");

const args = minimist(process.argv);

let configJSON = fs.readFileSync(args.config,"utf-8");
let config = JSON.parse(configJSON);

async function run(){
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--start-maximized'
        ]
    });

    let pages = await browser.pages();
    let page = pages[0];

    await page.goto(args.url);

    await page.waitForSelector("a[data-event-action='Login']");
    await page.click("a[data-event-action='Login']");

    await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    await page.click("a[href='https://www.hackerrank.com/login']");

    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']",config.username,{delay: 30});

    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']", config.password, { delay: 30 });

    await page.waitFor(1000);

    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");

    await page.waitForSelector("a[data-analytics='NavBarContests']");
    await page.click("a[data-analytics='NavBarContests']");

    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");

    await page.waitForSelector("a[data-attr1='Last']");
    let numPages = await page.$eval("a[data-attr1='Last']",function(atag){
        let numOfPages = atag.getAttribute("data-page");
        return parseInt(numOfPages);
    }); 

    for(let i = 0; i < numPages; i++){

        await handleSinglePage(browser,page);
        
        if(i != numPages - 1){
            await page.waitFor(2000);
            await page.waitForSelector("a[data-attr1='Right']")
            await page.click("a[data-attr1='Right']");
        }
    }

    await page.close();
}

async function handleSinglePage(browser,page){
    await page.waitForSelector("a.backbone.block-center");
    let curls = await page.$$eval("a.backbone.block-center",function(listOfATags){ 
        let urls = [];

        for(let i = 0; i < listOfATags.length; i++){
            let url = listOfATags[i].getAttribute("href");
            urls.push(url);
        }

        return urls;
    });

    for(let i = 0; i < curls.length; i++){
        await page.waitFor(1000);
        await handleSingleContest(browser,page,args.url + curls[i]);
    }
}

async function handleSingleContest(browser,page,url){
    let npage = await browser.newPage();
    await npage.goto(url);

    await npage.waitFor(2500);
    await npage.waitForSelector("li[data-tab='moderators']");
    await npage.click("li[data-tab='moderators']");

    for(let i = 0; i < config.moderators.length; i++){
        let moderator = config.moderators[i].name;
        await npage.waitForSelector("input#moderator");
        await npage.type("input#moderator",moderator,{delay : 50});

        await npage.waitForSelector("button.btn.moderator-save");
        await npage.click("button.btn.moderator-save");
    }
    
    await npage.waitFor(1000);
    await npage.close();
}

run();