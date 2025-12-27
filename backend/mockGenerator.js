/**
 * Mock Generator - Generates building specifications without Blender
 * This allows the app to work without Blender installation
 */

/**
 * Generate building parameters from uploaded blueprint
 * In a real implementation, this would use image processing to extract dimensions
 * For now, we return randomized but realistic building data
 */
function generateBuildingFromBlueprint(blueprintPath) {
    // Simulate different building types
    const buildingTypes = ['residential', 'commercial', 'high-rise', 'warehouse'];
    const type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];

    // Generate realistic dimensions based on type
    const specs = {
        residential: { floors: 2 + Math.floor(Math.random() * 3), width: 8 + Math.random() * 4, depth: 10 + Math.random() * 5 },
        commercial: { floors: 1 + Math.floor(Math.random() * 2), width: 15 + Math.random() * 10, depth: 20 + Math.random() * 10 },
        'high-rise': { floors: 10 + Math.floor(Math.random() * 20), width: 20 + Math.random() * 10, depth: 20 + Math.random() * 10 },
        warehouse: { floors: 1, width: 30 + Math.random() * 20, depth: 40 + Math.random() * 20 }
    };

    const building = specs[type];

    return {
        type: type,
        floors: building.floors,
        dimensions: {
            width: building.width,
            height: building.floors * (3 + Math.random()), // 3-4m per floor
            depth: building.depth
        },
        materials: {
            walls: type === 'high-rise' ? 'concrete' : 'brick',
            roof: type === 'warehouse' ? 'metal' : 'tiles',
            windows: building.floors > 5 ? 'glass' : 'standard'
        },
        blueprintPath: blueprintPath,
        generated: true,
        timestamp: new Date().toISOString()
    };
}

/**
 * Generate disaster simulation parameters
 */
function generateDisasterParams(disasterType, intensity = 5) {
    const baseParams = {
        earthquake: {
            magnitude: 4 + (intensity / 10) * 5, // 4.0 to 9.0
            duration: 10 + intensity * 2, // 10-30 seconds
            epicenterDistance: Math.random() * 100, // km
            shakePattern: ['horizontal', 'vertical', 'rolling'][Math.floor(Math.random() * 3)]
        },
        flood: {
            waterLevel: intensity * 0.5, // 0.5 to 5 meters
            riseSpeed: 0.1 + (intensity / 10) * 0.4, // m/s
            waveHeight: intensity * 0.3,
            flowDirection: Math.random() * 360
        },
        fire: {
            startLocations: Math.ceil(intensity / 3), // 1-3 starting points
            spreadRate: 0.5 + (intensity / 10) * 2, // m/s
            intensity: intensity * 10, // percentage
            windSpeed: Math.random() * 20 // km/h
        },
        hurricane: {
            category: Math.ceil(intensity / 2), // 1-5
            windSpeed: 100 + intensity * 20, // km/h
            rainfall: intensity * 50, // mm/hour
            duration: 60 + intensity * 30 // minutes
        }
    };

    return baseParams[disasterType] || baseParams.earthquake;
}

module.exports = {
    generateBuildingFromBlueprint,
    generateDisasterParams
};
