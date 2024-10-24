// utils/colorMap.ts

// Helper to convert hex to RGB
const hexToRgb = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return [r, g, b]
}

// Helper to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// Linear interpolation between two values
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

// Function to interpolate between two colors
const interpolateColor = (
    color1: string,
    color2: string,
    factor: number
): string => {
    const [r1, g1, b1] = hexToRgb(color1)
    const [r2, g2, b2] = hexToRgb(color2)
    const r = Math.round(lerp(r1, r2, factor))
    const g = Math.round(lerp(g1, g2, factor))
    const b = Math.round(lerp(b1, b2, factor))
    return rgbToHex(r, g, b)
}

// Colormap gradient function
export const getColorFromValue = (value: number): string => {
    // Define your color breakpoints
    const colors = [
        { stop: 0, color: '#8B0000' }, // Dark Red (worst)
        { stop: 0.0833, color: '#F91515' }, // Bright Red
        { stop: 0.1667, color: '#FF8282' }, // Light Red
        { stop: 0.25, color: '#FF8C00' }, // Dark Orange
        { stop: 0.3333, color: '#FFB347' }, // Medium Orange
        { stop: 0.4167, color: '#FBD08F' }, // Light Orange
        { stop: 0.5, color: '#CAF9AB' }, // Very Light Green
        { stop: 0.5833, color: '#A9F97B' }, // Pale Green
        { stop: 0.6667, color: '#70F915' }, // Light Green
        { stop: 0.75, color: '#32CD32' }, // Lime Green
        { stop: 0.8333, color: '#228B22' }, // Forest Green
        { stop: 0.9167, color: '#0B6623' }, // Dark Green (best)
    ]

    // Find the two nearest color stops
    let lowerColor = colors[0]
    let upperColor = colors[colors.length - 1]
    for (let i = 0; i < colors.length - 1; i++) {
        if (value >= colors[i].stop && value <= colors[i + 1].stop) {
            lowerColor = colors[i]
            upperColor = colors[i + 1]
            break
        }
    }

    // Calculate interpolation factor (between 0 and 1)
    const range = upperColor.stop - lowerColor.stop
    const factor = (value - lowerColor.stop) / range

    // Interpolate between the lower and upper colors
    return interpolateColor(lowerColor.color, upperColor.color, factor)
}
