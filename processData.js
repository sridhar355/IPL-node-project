const fs = require('fs');

function processIPLData() {
    const rawData = fs.readFileSync('iplData.json');
    const data = JSON.parse(rawData);

    const processedData = {};

    for (let season in data) {
        processedData[season] = {
            topPlayers: data[season].sort((a, b) => parseInt(b.runs) - parseInt(a.runs)).slice(0, 10),
            mostFours: data[season].sort((a, b) => parseInt(b.fours) - parseInt(a.fours)).slice(0, 10),
            mostSixes: data[season].sort((a, b) => parseInt(b.sixes) - parseInt(a.sixes)).slice(0, 10),
            mostCenturies: data[season].sort((a, b) => parseInt(b.centuries) - parseInt(a.centuries)).slice(0, 10),
            mostFifties: data[season].sort((a, b) => parseInt(b.fifties) - parseInt(a.fifties)).slice(0, 10),
        };
    }

    fs.writeFileSync('processedIPLData.json', JSON.stringify(processedData, null, 2));
    console.log('Data processed and saved to processedIPLData.json');
}

processIPLData();
