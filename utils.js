const fs = require('fs');
const path = require('path');

const getStudioListingUrl = page => `https://www.domain.com.au/rent/sydney-nsw-2000/?price=0-600&ssubs=1&features=furnished${
    page > 1 ? `&page=${page}` : ''
}`;

const getBedroomListingUrl = page => `https://www.domain.com.au/rent/sydney-nsw-2000/?bedrooms=1-any&price=500-600&excludedeposittaken=1&carspaces=1-any&keywords=pool${
    page > 1 ? `&page=${page}` : ''
}`;

const fileName = path.join(__dirname, 'apartments.json');
const readData = () => (fs.existsSync(fileName) ? JSON.parse(fs.readFileSync(fileName)) : {});
const writeData = data => fs.writeFileSync(fileName, JSON.stringify(data, null, 4));

module.exports = {
    getBedroomListingUrl,
    getStudioListingUrl,
    readData,
    writeData,
};

