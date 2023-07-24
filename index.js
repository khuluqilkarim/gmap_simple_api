const puppeteer = require("puppeteer");
const express = require("express");
const app = express();

async function get_data(tinggal, des) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.google.com/maps/dir/${tinggal}/${des}/`);

  await page.waitForSelector(".Fl2iee");
  const element = await page.$(".Fl2iee");

  await element.click();

  const result = await page.evaluate(() => {
    const divElement = document.querySelector(".XdKEzd");
    const values = Array.from(divElement.querySelectorAll("div")).map((div) =>
      div.textContent.trim()
    );

    return {
      time: values[0],
      distance: values[1],
    };
  });
  await browser.close();
  return result;
}

app.get("/rute/:tinggal/:des", async (req, res) => {
  try {
    var tinggal = req.params.tinggal;
    var destinasi = req.params.des;
    var result = await get_data(tinggal, destinasi);
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running at port ${port}`);
});
