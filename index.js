const puppeteer = require("puppeteer");
const readline = require("readline");
const read = require("read");
const constants = require("./constants");
const chalk = require("chalk");
const { log } = console;

// array: [selector0, inputValue0, selector1, inputValue1, ...]
async function insertLoginInfo(page, array) {
  for (let i = 0; i < array.length / 2; i++) {
    await page.focus(array[i * 2]);
    page.type(array[i * 2 + 1]);
  }
}

function readInput(option) {
  return new Promise((resolve, reject) =>
    read(option, (err, assignVarFrom) => {
      if (err) {
        reject(err);
      }
      console.log(assignVarFrom);
      resolve(assignVarFrom);
    })
  );
}

const start = async () => {
  /*
  
  Init
  
  */
  const browser = await puppeteer.launch({ args: ["--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  /*
  
  HKU LOGIN PART
  
  */
  log(constants.get("HKU_LOGIN_LINK"));

  log(constants.get("USERNAME"));

  log(constants.get("PASSWORD"));

  log(constants.get("LOGIN_BUTTON"));
  await page.goto(constants.get("HKU_LOGIN_LINK"));
  await page.evaluate(
    () => {
      document.querySelector("#username").value = "yo1o";
      document.querySelector("#password").value = "test";
    },
    "yo1o",
    "test"
  );

  const username = await page.evaluate(
    () => document.querySelector("#username").value
  );
  const password = await page.evaluate(
    () => document.querySelector("#password").value
  );

  log(
    chalk.green(`:: Value Check ::
  username: ${username}
  password: ${password}
  `)
  );
  log(page.url());

  await browser.close();
};

start();
