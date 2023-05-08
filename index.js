const {
    Builder, By,
} = require('selenium-webdriver');
const {
    getBedroomListingUrl,
    readData,
    writeData,
} = require('./utils');

const getListingDetails = async (root) => {
    const priceEl = await root.findElement(By.css('p.listing-result__price'));
    const price = await priceEl.getText();
    const anchorEl = await root.findElement(By.css('a.address.is-two-lines'));
    const href = await anchorEl.getAttribute('href');
    const address = await anchorEl.getAttribute('text');

    return {
        price,
        href,
        address,
    };
};

const updateData = async (input) => {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        let i = 1;

        while (i <= 7) {
            const url = getBedroomListingUrl(i);
            i += 1;
            await driver.get(url);
            const listingRoots = await driver.findElements(By.css('div.listing-result__details.listing-result__right'));
            const data = await Promise.all(listingRoots.map(getListingDetails));

            input.domain = input.domain || {};

            data.forEach(({
                price,
                href,
                address,
            }) => {
                const exists = !!input.domain[href];
                input.domain[href] = input.domain[href] || {};
                input.domain[href].address = address;
                input.domain[href].price = price;
                if (!exists) {
                    input.domain[href].new = true;
                }
            });
        }
    } catch (e) {
        console.log(e);
    } finally {
        await driver.quit();
    }
};

const show = (data) => {
    const result = Object.entries(data.domain)
        .filter(([key, value]) => (typeof value.grade === 'undefined' || value.grade >= 6))
        .reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {});

    console.log(JSON.stringify(result, null, 4));
};

const main = async () => {
    const data = readData();
    await updateData(data);
    writeData(data);
    show(data);
};

main();
