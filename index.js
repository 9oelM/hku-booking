const puppeteer = require("puppeteer");
const inquirer = require("inquirer");
const ora = require("ora");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const C = require("./constants");
const lib = require("./lib");
const { success, warning, info, safeRequire } = require("./helper");
const { log } = console;
let creds = safeRequire(
  "./credentials",
  "Credentials.js was not found. You have to manually type in your username and password.",
  {}
);

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

const checkURL = page => info("Current URL: " + page.url());

const run = async () => {
  if (!(creds.username && creds.password)) {
    const { USERNAME, PASSWORD } = await inquirer.prompt([
      {
        name: "USERNAME",
        type: "input",
        message: "Tell me your HKU portal username: "
      },
      {
        name: "PASSWORD",
        type: "password",
        message: "Tell me your HKU portal password: "
      }
    ]);
    creds = {
      ...creds,
      username: USERNAME,
      password: PASSWORD
    };
  }

  const spinner = ora().start();
  spinner.info(
    "Launching browser and page. If you have chrome, it will automatically launch and do things for you."
  );
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ]
  });
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
  spinner.info("Attempting to log in...");

  await page.evaluate(
    ({ username, password, usernameSelector, passwordSelector }) => {
      document.querySelector(usernameSelector).value = username;
      document.querySelector(passwordSelector).value = password;
    },
    {
      username: creds.username,
      password: creds.password,
      usernameSelector: C.USERNAME,
      passwordSelector: C.PASSWORD
    }
  );

  await Promise.all([
    page.click(C.LOGIN_BUTTON),
    page.waitForNavigation({ waitUntil: "domcontentloaded" })
  ]);

  await page
    .waitForSelector(".schedule_title", { timeout: 1000 * 10 })
    // one of the selectors in the page (http://booking.its.hku.hk/lebook/book/Web/schedule.php)
    .then(() => spinner.succeed("Login successful!"));

  const table = await page.evaluate(
    ({ reservationSelector }) =>
      document.getElementById(reservationSelector).innerHTML,
    { reservationSelector: C.RESERVATION }
  );

  const dom = new JSDOM(`<html><body>${table}</body></html>`, {
    runScripts: "dangerously"
  });
  // Set window and document from jsdom
  const { window } = dom;
  const { document } = window;
  const $ = (global.jQuery = require("jquery")(window));
  require("table-to-json")

  const rtable = $(".reservations");
  log(rtable);
  log($.fn.tableToJSON)
  (jQuery &&
    dom) ?
    success("jQuery and virtual dom are successfully initialized.") : warning("jQuery and virtual dom are not successfully initialized.");
  rtable ? success("Target table has been found.") : warning("Target table not found.")
  $.fn.tableToJSON ? success("tableToJSON was successfully injected as jQuery plugin") : warning("tableToJSON was not successfully injected as jQuery plugin")

  const tableInJson = $(".reservations").tableToJSON();
  
  log(tableInJson);
  checkURL(page);

  const answers = await askQs();
  const { CHOICE, ROOM, DATE, TIME } = answers;
  await browser.close();
};

try {
  run();
} catch (e) {
  console.log(e);
}
