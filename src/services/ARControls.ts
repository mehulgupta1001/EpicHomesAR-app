// AR Controls Service for Epic Homes AR
// Handles rotation, scaling, and positioning of 3D models

export interface ARControlState {
  rotation: number;
  scale: number;
  position: { x: number; y: number; z: number };
}

export interface ARControlLimits {
  minScale: number;
  maxScale: number;
  minRotation: number;
  maxRotation: number;
}

export class ARControls {
  private static readonly DEFAULT_LIMITS: ARControlLimits = {
    minScale: 0.5,
    maxScale: 3.0,
    minRotation: -360,
    maxRotation: 360
  };

  /**
   * Rotate model left
   * @param currentRotation - Current rotation value
   * @param step - Rotation step (default: 15 degrees)
   * @returns New rotation value
   */
  static rotateLeft(currentRotation: number, step: number = 15): number {
    const newRotation = currentRotation - step;
    return this.clampRotation(newRotation);
  }

  /**
   * Rotate model right
   * @param currentRotation - Current rotation value
   * @param step - Rotation step (default: 15 degrees)
   * @returns New rotation value
   */
  static rotateRight(currentRotation: number, step: number = 15): number {
    const newRotation = currentRotation + step;
    return this.clampRotation(newRotation);
  }

  /**
   * Scale model up
   * @param currentScale - Current scale value
   * @param step - Scale step (default: 0.1)
   * @returns New scale value
   */
  static scaleUp(currentScale: number, step: number = 0.1): number {
    const newScale = currentScale + step;
    return this.clampScale(newScale);
  }

  /**
   * Scale model down
   * @param currentScale - Current scale value
   * @param step - Scale step (default: 0.1)
   * @returns New scale value
   */
  static scaleDown(currentScale: number, step: number = 0.1): number {
    const newScale = currentScale - step;
    return this.clampScale(newScale);
  }

  /**
   * Reset model to default state
   * @returns Default control state
   */
  static reset(): ARControlState {
    return {
      rotation: 0,
      scale: 1,
      position: { x: 0, y: 0, z: 0 }
    };
  }

  /**
   * Clamp rotation value within limits
   * @param rotation - Rotation value to clamp
   * @returns Clamped rotation value
   */
  private static clampRotation(rotation: number): number {
    const { minRotation, maxRotation } = this.DEFAULT_LIMITS;
    return Math.max(minRotation, Math.min(maxRotation, rotation));
  }

  /**
   * Clamp scale value within limits
   * @param scale - Scale value to clamp
   * @returns Clamped scale value
   */
  private static clampScale(scale: number): number {
    const { minScale, maxScale } = this.DEFAULT_LIMITS;
    return Math.max(minScale, Math.min(maxScale, scale));
  }

  /**
   * Get control limits
   * @returns Control limits
   */
  static getLimits(): ARControlLimits {
    return { ...this.DEFAULT_LIMITS };
  }

  /**
   * Update control limits
   * @param limits - New control limits
   */
  static updateLimits(limits: Partial<ARControlLimits>): void {
    Object.assign(this.DEFAULT_LIMITS, limits);
  }

  /**
   * Validate control state
   * @param state - Control state to validate
   * @returns Validated control state
   */
  static validateState(state: ARControlState): ARControlState {
    return {
      rotation: this.clampRotation(state.rotation),
      scale: this.clampScale(state.scale),
      position: state.position // Position validation can be added if needed
    };
  }
}
