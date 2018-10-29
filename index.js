const puppeteer = require("puppeteer");
const readline = require("readline");
const read = require("read");
const C = require("./constants");
const chalk = require("chalk");
const { log } = console;

// array: [selector0, inputValue0, selector1, inputValue1, ...]
async function insertInfo(page, array) {
  for (let i = 0; i < array.length / 2; i++) {
    await page.evaluate((array, i) => {
      console.log(
        `${document.querySelector(array[i * 2]).value} = ${array[i * 2 + 1]}`
      );
      document.querySelector(array[i * 2]).value = array[i * 2 + 1];
    }, array[i * 2 + 1]);
  }
}

function readInput(option) {
  return new Promise((resolve, reject) =>
    read(option, (err, assignVarFrom) => {
      if (err) {
        reject(err);
      }
      resolve(assignVarFrom);
    })
  );
}

function checkURL(page) {
  log(chalk.bgBlue("Current URL: " + page.url()));
}

const start = async () => {
  /*
  
  Init
  
  */
  log(chalk.bgGreen("Launching browser and page..."));
  const browser = await puppeteer.launch({ args: ["--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  /*
  
  HKU LOGIN PART
  
  */
  /*
  1. Go onto HKU Portal Login Link that would redirect to booking system
  */
  await page.goto(C.get("HKU_LOGIN_LINK"));
  checkURL(page);
  /*
  2. Receive user inputs for id and pw
  */
  let username = await readInput({
    prompt: "Please enter your HKU Portal ID: "
  });
  let password = await readInput({
    prompt: "Please enter your HKU Portal PIN: ",
    silent: true
  });
  /*
  3. Inject those info into the webpage
  */
  await page.evaluate(
    ({ username, password }) => {
      document.querySelector("#username").value = username;
      document.querySelector("#password").value = password;
    },
    {
      username,
      password
    }
  );
  /*
  4. Check info
  */
  const un = await page.evaluate(
    () => document.querySelector("#username").value
  );
  const pw = await page.evaluate(
    () => document.querySelector("#password").value
  );

  if (!(un && pw)) {
    // something's wrong
    log(chalk.bgRed("You entered an invalid input. Please try again."));
  } else {
    log(chalk.bgGreen("Username and password check done. Good to go."));
  }
  /*
  5. Click login button
  */
  await Promise.all([
    page.click(C.get("LOGIN_BUTTON")),
    page.waitForNavigation({ waitUntil: "domcontentloaded" })
  ]);
  /* 
  6. wait until redirection
  */
  await page
    .waitForSelector(".schedule_title", { timeout: 1000 * 10 })
    // one of the selectors in the page (http://booking.its.hku.hk/lebook/book/Web/schedule.php)
    .then(() => log(chalk.bgGreen("Page redirection successful")));
  // await page.waitFor(6000);
  checkURL(page);
  await browser.close();
};

start();
