interface Measurements {
  width: number;
  length: number;
  height: number;
  platformHeight: number;
}

const VALID_RANGES = {
  width: { min: 5.5, max: 9.0 }, // meters (18-30 feet)
  length: { min: 4.5, max: 7.5 }, // meters (15-25 feet)
  height: { min: 2.4, max: 4.5 }, // meters (8-15 feet)
  platformHeight: { min: 0.6, max: 2.1 }, // meters (2-7 feet)
};

export const validateMeasurements = (measurements: Measurements): { 
  isValid: boolean; 
  errors: string[];
} => {
  const errors: string[] = [];

  Object.entries(measurements).forEach(([key, value]) => {
    const range = VALID_RANGES[key as keyof Measurements];
    if (value < range.min || value > range.max) {
      errors.push(
        `${key} of ${value.toFixed(2)}m is outside valid range (${range.min}-${range.max}m)`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const formatMeasurement = (value: number): string => {
  const meters = value.toFixed(2);
  const feet = (value * 3.28084).toFixed(2);
  return `${meters}m (${feet}ft)`;
}; 