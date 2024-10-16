// Import turf.js for geospatial calculations and fs for writing to a file
import turf from '@turf/turf'
import fs from 'fs'
import { Position } from 'geojson';

// Function to split LineString into equal parts
function splitLineStringIntoEqualParts(startCoord: Position, endCoord: Position, parts: number) {

    // Create a GeoJSON LineString with the input coordinates
    //   const line: FeatureCollection = {
    //     "type": "FeatureCollection",
    //     "features": [
    //       {
    //         "type": "Feature",
    //         "properties": {},
    //         "geometry": {
    //           "type": "LineString",
    //           "coordinates": [startCoord, endCoord]
    //         }
    //       }
    //     ]
    //   };

  // Use turf.js to calculate the length of the line
  const lineString = turf.lineString([startCoord, endCoord]);
  const totalLength = turf.length(lineString, { units: 'kilometers' });
  const segmentLength = totalLength / parts;

  const newFeatures = [];
  let currentDistance = 0;

  // Split the line into equal segments
  for (let i = 0; i < parts; i++) {
    const startPoint = turf.along(lineString, currentDistance, { units: 'kilometers' });
    const endPoint = turf.along(lineString, currentDistance + segmentLength, { units: 'kilometers' });

    // Create new LineString segment
    const segment = {
      "type": "Feature",
      "properties": {},
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
const startCoord = [123.89673085361744, 10.295505057551836];
const endCoord = [123.89796705299966, 10.296053246556028];
const parts = 10;  // Number of parts to split into

const splitGeoJSON = splitLineStringIntoEqualParts(startCoord, endCoord, parts);

// Write the result to a JSON file
fs.writeFileSync('splitLineString.json', JSON.stringify(splitGeoJSON, null, 2), 'utf8');

console.log('GeoJSON has been written to splitLineString.json');
