import { lineString, length, along } from '@turf/turf';
import fs from 'fs';

const getRandomWeight = () => {
  return Math.floor(Math.random() * (20 - 5 + 1)) + 5;
}

const splitLineStringIntoEqualPartsByLength = (coordinates, segmentLength) => {
  const newFeatures = [];

  coordinates.forEach(({ start, end }) => {
    const lineStringFeature = lineString([start, end]);
    const totalLength = length(lineStringFeature, { units: 'kilometers' });
    
    let currentDistance = 0;

    // Create segments of fixed length until the total length is reached
    while (currentDistance < totalLength) {
      const startPoint = along(lineStringFeature, currentDistance, { units: 'kilometers' });
      let endPointDistance = currentDistance + segmentLength;

      // Ensure the last segment ends at the final point if it exceeds total length
      if (endPointDistance > totalLength) {
        endPointDistance = totalLength;
      }

      const endPoint = along(lineStringFeature, endPointDistance, { units: 'kilometers' });

      const segment = {
        "type": "Feature",
        "properties": {
          "weight": getRandomWeight()
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [startPoint.geometry.coordinates, endPoint.geometry.coordinates]
        }
      };

      newFeatures.push(segment);
      currentDistance = endPointDistance;
    }
  });

  return {
    "type": "FeatureCollection",
    "features": newFeatures
  };
}

const coordinates = [
  // triangle block
  {
    start: [123.89665561184698,10.29545915060376],
    end: [123.89791893229744,10.29600278893757]
  },
  {
    start: [123.89791893229744,10.29600278893757],
    end: [123.8980329261816,10.295902506210316]
  },
  {
    start: [123.8980329261816,10.295902506210316],
    end: [123.89774420304177,10.29498398365206]
  },
  {
    start: [123.89774420304177,10.29498398365206],
    end: [123.89665561184698,10.29545915060376]
  },
  // gaisano block
  {
    start: [123.89654941684468,10.295559140009777],
    end: [123.89791197903206,10.296130487852418]
  },
  {
    start: [123.89791197903206,10.296130487852418],
    end: [123.89813326127289,10.296274314287167]
  },
  {
    start: [123.89813326127289,10.296274314287167],
    end: [123.89749016224854,10.297568206596972]
  },
  {
    start: [123.89749016224854,10.297568206596972],
    end: [123.89739367820847,10.297666652439753]
  },
  {
    start: [123.89739367820847,10.297666652439753],
    end: [123.89608667777658,10.297260973969658]
  },
  {
    start: [123.89608667777658,10.297260973969658],
    end: [123.89654941684468,10.295559140009777]
  },
]

// The fixed length for each segment in kilometers
const segmentLength = 0.0075;

const splitGeoJSON = splitLineStringIntoEqualPartsByLength(coordinates, segmentLength);

// Write the result to a JSON file
fs.writeFileSync('data/geojson/colon.json', JSON.stringify(splitGeoJSON, null, 2), 'utf8');

console.log('GeoJSON has been written to colon.json');
