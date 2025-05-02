// convert.js
const csv = require('csvtojson');
const fs  = require('fs');
const path = require('path');

// 1. File paths
const IN  = 'data/Tilbudsportalen - Aktivitets- og samværstilbud.csv';
const OUT = 'data/samvaer.geojson';


(async () => {
  // 2. Read CSV → array of objects (keys from your headers)
  const rows = await csv().fromFile(IN);

  // 3. Build GeoJSON with ALL properties
  const geojson = {
    type: 'FeatureCollection',
    features: rows.map((r, i) => ({
      type: 'Feature',
      id: i,
      properties: { ...r },         // ← include every column
      geometry: {
        type: 'Point',
        coordinates: [
          parseFloat(r.Longitude),
          parseFloat(r.Latitude)
        ]
      }
    }))
  };

  // 4. Write out the .geojson
  fs.writeFileSync(OUT, JSON.stringify(geojson, null, 2));
  console.log(`✔ Wrote ${OUT} with ${rows.length} features.`);
})()