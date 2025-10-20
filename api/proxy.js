// api/proxy.js
import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const endpoint = req.query.endpoint || "";
  if (!endpoint) return res.status(400).json({ error: "Falta endpoint" });

  const url = `https://manualprojumi.ct.ws/${endpoint}`;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const body = await page.content();
    await browser.close();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(body);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}