// Import the required functions from turf.js
import { lineString, length, along } from '@turf/turf';
import fs from 'fs';

// Function to generate a random weight between 5 and 20
function getRandomWeight() {
  return Math.floor(Math.random() * (20 - 5 + 1)) + 5;
}

// Function to split LineString into equal parts and assign random weights
function splitLineStringIntoEqualParts(startCoord, endCoord, parts) {
  // Create a GeoJSON LineString with the input coordinates
  const lineStringFeature = lineString([startCoord, endCoord]);
  
  // Use turf.js to calculate the length of the line
  const totalLength = length(lineStringFeature, { units: 'kilometers' });
  const segmentLength = totalLength / parts;

  const newFeatures = [];
  let currentDistance = 0;

  // Split the line into equal segments
  for (let i = 0; i < parts; i++) {
    const startPoint = along(lineStringFeature, currentDistance, { units: 'kilometers' });
    const endPoint = along(lineStringFeature, currentDistance + segmentLength, { units: 'kilometers' });

    // Create new LineString segment with a random weight
    const segment = {
      "type": "Feature",
      "properties": {
        "weight": getRandomWeight()  // Assign a random weight between 5 and 20
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [startPoint.geometry.coordinates, endPoint.geometry.coordinates]
      }
    };

    newFeatures.push(segment);
    currentDistance += segmentLength;
  }

  // Return new GeoJSON FeatureCollection with the split segments
  return {
    "type": "FeatureCollection",
    "features": newFeatures
  };
}

// Example Usage:
const startCoord = [
  123.896783,
  10.295484
];
const endCoord = [
  123.89769997786605,
  10.295012883867143
];
const parts = 10;  // Number of parts to split into

const splitGeoJSON = splitLineStringIntoEqualParts(startCoord, endCoord, parts);

// Write the result to a JSON file
fs.writeFileSync('splitLineString.json', JSON.stringify(splitGeoJSON, null, 2), 'utf8');

console.log('GeoJSON has been written to splitLineString.json');
