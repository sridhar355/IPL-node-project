const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeIPLData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const seasons = [2023, 2022, 2021, 2020, 2019];  // Last 5 seasons
    const baseUrl = 'https://www.iplt20.com/stats/';

    let data = {};

    for (let season of seasons) {
        try {
            await page.goto(`${baseUrl}${season}`, { waitUntil: 'networkidle2', timeout: 60000 });
            await page.waitForSelector('.top-players__last-name', { timeout: 60000 });

            const seasonData = await page.evaluate(() => {
                const rows = document.querySelectorAll('.top-players__last-name');
                const stats = [];

                rows.forEach(row => {
                    const player = {
                        name: row.querySelector('.top-players__last-name').innerText,
                        runs: row.querySelector('.top-players__runs').innerText,
                        fours: row.querySelector('.top-players__fours').innerText,
                        sixes: row.querySelector('.top-players__sixes').innerText,
                        centuries: row.querySelector('.top-players__centuries').innerText,
                        fifties: row.querySelector('.top-players__fifties').innerText,
                    };
                    stats.push(player);
                });

                return stats;
            });

            data[season] = seasonData;
        } catch (error) {
            console.error(`Failed to scrape data for season ${season}:`, error);
        }
    }

    await browser.close();

    fs.writeFileSync('iplData.json', JSON.stringify(data, null, 2));
    console.log('Data scraped and saved to iplData.json');
}

scrapeIPLData();
