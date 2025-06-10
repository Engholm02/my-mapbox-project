const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const files = [
  { input: '104.csv', output: '104.geojson' },
  { input: '105.csv', output: '105.geojson' },
  { input: '107.csv', output: '107.geojson' },
  { input: '108.csv', output: '108.geojson' },
  { input: '108a.csv', output: '108a.geojson' },
  { input: 'Boliga_geocoded.csv', output: 'Boliga_geocoded.geojson' },
  { input: 'ejendomstorvet_geocoded.csv', output: 'ejendomstorvet_geocoded.geojson' }
];

files.forEach(({ input, output }) => {
  const inputPath = path.join(__dirname, 'data', input);
  const outputPath = path.join(__dirname, 'data', output);

  csv()
    .fromFile(inputPath)
    .then((jsonArray) => {
      const features = jsonArray.map((row, index) => {
        const lat = parseFloat(row.Latitude || row.latitude);
        const lon = parseFloat(row.Longitude || row.longitude);

        return {
          type: 'Feature',
          id: index,
          properties: row,
          geometry: (!isNaN(lat) && !isNaN(lon)) ? {
            type: 'Point',
            coordinates: [lon, lat]
          } : null
        };
      });

      const geojson = {
        type: 'FeatureCollection',
        features: features
      };

      fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
      console.log(`✅ ${output} created.`);
    });
});