const puppeteer = require("puppeteer");

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });
  // go to site
  const page = await browser.newPage();
  await page.goto("https://hdl1-training-statuses.web.app/");

  //sign in to testing account
  await new Promise((r) => setTimeout(r, 1000));
  await page.click("#signin-button");
  await page.type("#sign-in-email", "erday2@wisc.edu");
  await page.type("#sign-in-password", "ethantest");
  await new Promise((r) => setTimeout(r, 1000));
  await page.click("#signin_form > button.button.is-primary");

  // add employee
  await new Promise((r) => setTimeout(r, 1000));

  await page.click("#signed-in-div > nav > div.navbar-brand > a");
  await page.click("#add-employee-button");
  await page.type("#employee-code", "WSCO");
  await page.$eval("#hire-date", (date) => (date.value = "2024-12-11"));
  await page.$eval("#exp-grad-year", (input) => (input.value = ""));
  await page.type("#exp-grad-year", "2027");
  await page.click("#add-employee");

  // delete employee
  await new Promise((r) => setTimeout(r, 1000));

  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await new Promise((r) => setTimeout(r, 1000));

  await page.click("#user-page-delete-button");

  await new Promise((r) => setTimeout(r, 1000));

  browser.close();
}

go();
