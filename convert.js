// convert.js
const csv = require('csvtojson');
const fs  = require('fs');
const path = require('path');

// 1. File paths
const IN  = path.join(__dirname, 'data', 'botilbud2_geocoded.csv');
const OUT = path.join(__dirname, 'data', 'botilbud2_geocoded.geojson');

(async () => {
  // 2. Read CSV → array of objects (keys from your headers)
  const rows = await csv().fromFile(IN);

  // 3. Build GeoJSON with ALL properties
  const geojson = {
    type: 'FeatureCollection',
    features: rows.map((r, i) => {
      const lat = parseFloat(r.latitude);
      const lon = parseFloat(r.longitude);
      return {
        type: 'Feature',
        id: i,
        properties: { ...r },
        geometry: {
          type: 'Point',
          coordinates: [
            isNaN(lon)  ? null : lon,
            isNaN(lat)  ? null : lat
          ]
        }
      };
    })
  };

  // 4. Write out the .geojson
  fs.writeFileSync(OUT, JSON.stringify(geojson, null, 2));
  console.log(`✔ Wrote ${OUT} with ${rows.length} features.`);
})()