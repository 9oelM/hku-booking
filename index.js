const puppeteer = require("puppeteer");
const readline = require("readline");

const C = {
  HKU_LOGIN: {
    LINK:
      "https://hkuportal.hku.hk/cas/servlet/edu.yale.its.tp.cas.servlet.Login?service=http://booking.its.hku.hk/lebook/book/Web/",
    USERNAME: "#username",
    PASSWORD: "#password"
  }
};

const start = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(C.HKU_LOGIN.LINK);
  let bodyHTML = await page.evaluate(() => document.body.innerHTML);

  console.log(bodyHTML);
  await browser.close();
};

// array: [selector0, inputValue0, selector1, inputValue1, ...]
const insertLoginInfo = async array => {
  for (let i = 0; i < array.length / 2; i++) {
    await page.focus("#lst-ib");
    page.type("China");
  }
};

start();
