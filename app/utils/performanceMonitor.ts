export type MetricCategory = 'modelLoading' | 'arInitialization' | 'rendering';
export type MetricName = 'startup' | 'frame' | 'house_model';

interface PerformanceMetric {
  startTime: number;
  endTime?: number;
  duration?: number;
  category: MetricCategory;
  name: MetricName;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private thresholds = {
    modelLoading: 3000,
    arInitialization: 2000,
    rendering: 16,
  };

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMetric(category: MetricCategory, name: MetricName): string {
    const id = `${category}-${name}-${Date.now()}`;
    this.metrics.set(id, {
      startTime: Date.now(),
      category,
      name,
    });
    return id;
  }

  endMetric(id: string): void {
    const metric = this.metrics.get(id);
    if (!metric) return;

    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;

    const threshold = this.thresholds[metric.category];
    if (metric.duration > threshold) {
      console.warn(
        `Performance warning: ${metric.category} - ${metric.name} took ${metric.duration}ms ` +
        `(threshold: ${threshold}ms)`
      );
    }
  }

  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance(); 