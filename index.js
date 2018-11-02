const puppeteer = require("puppeteer");
const inquirer = require("inquirer");
const ora = require("ora");
const C = require("./constants");
const lib = require("./lib");
const creds = require("./credentials");
const log = require("./helper");

const askQs = () => {
  const questions = [
    {
      name: "DATE",
      type: "list",
      message: "Tell me which date you want to use the room",
      choices: lib.getDates()
    },
    {
      name: "TIME",
      type: "list",
      message: "Tell me which time you want to use the room",
      choices: lib.getDates()
    },
    {
      name: "ROOM",
      type: "list",
      message: "Tell me which room you want to use",
      pageSize: 10,
      choices: lib.getRooms()
    }
  ];
  return inquirer.prompt(questions);
};
function checkURL(page) {
  log.info("Current URL: " + page.url());
}

const test = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage();
  log.success("cool")
}

const run = async () => {
  const spinner = ora().start();
  spinner.info("Launching browser and page...");
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', "--disable-dev-shm-usage"]});
  const page = await browser.newPage();
  /*
    1. Go onto HKU Portal Login Link that would redirect to booking system
    */
  spinner.info("Going onto HKU Login page...");
  await page.goto(C.HKU_LOGIN_LINK);
  checkURL(page);
  /*
    2. If the user already typed in credentials information, go right onto the booking page and fetch booking information
    */
  if (creds.username && creds.password) {
    spinner.info(
      "Username and password preconfigured in credentials.js found. Attempting to log in..."
    );

    await page.evaluate(
      ({ username, password }) => {
        document.querySelector("#username").value = username;
        document.querySelector("#password").value = password;
      },
      {
        username: creds.username,
        password: creds.password
      }
    );

    await Promise.all([
      page.click(C.get("LOGIN_BUTTON")),
      page.waitForNavigation({ waitUntil: "domcontentloaded" })
    ]);

    await page
      .waitForSelector(".schedule_title", { timeout: 1000 * 10 })
      // one of the selectors in the page (http://booking.its.hku.hk/lebook/book/Web/schedule.php)
      .then(() => spinner.succeed("Login successful!"));
    // await page.waitFor(6000);
    checkURL(page);
  } else {
  }
  await browser.close();
  const answers = await askQs();
  const { CHOICE, ROOM, DATE, TIME } = answers;
};

try {
  run();
} catch (e) {
  console.log(e);
}
