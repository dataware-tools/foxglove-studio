type PointOptions = {
  // Geometry for limiting point to a certain area
  limit?: {
    maxX: number;
    maxY: number;
    minX?: number;
    minY?: number;
  };
};

export class Point {
  // x and y are in the coordinate system of the image (in float pixels).
  x: number;
  y: number;

  constructor(x: number, y: number, { limit }: PointOptions = {}) {
    if (limit) {
      this.x = Math.max(limit.minX ?? 0, Math.min(limit.maxX, x));
      this.y = Math.max(limit.minY ?? 0, Math.min(limit.maxY, y));
    } else {
      this.x = x;
      this.y = y;
    }
  }

  // If the point is such close to the other point as to be considered the same point
  samePointTo(other: Point, threshold = 8) {
    return Math.abs(this.x - other.x) < threshold && Math.abs(this.y - other.y) < threshold;
  }

  // Calculate the middle point between this point and the other point
  middlePointTo(other: Point) {
    return new Point((this.x + other.x) / 2, (this.y + other.y) / 2);
  }

  // Calculate the horizontal difference between this point and the other point
  horizontalDifferenceTo(other: Point) {
    return Math.abs(this.x - other.x);
  }

  // Calculate the vertical difference between this point and the other point
  verticalDifferenceTo(other: Point) {
    return Math.abs(this.y - other.y);
  }

  // Calculate the vector from this point to the other point
  vectorToPoint(other: Point) {
    return new Point(other.x - this.x, other.y - this.y);
  }

  // Get the point in integer pixels
  getPointInPixels() {
    return new Point(Math.round(this.x), Math.round(this.y));
  }

  // Get the point differed by the given difference
  getPointDifferedBy(x: number, y: number) {
    return new Point(this.x + x, this.y + y);
  }

  // Returns new Point instance of the point
  clone() {
    return new Point(this.x, this.y);
  }
}

export type AnnotationType = "rect" | "point";

export type Annotation = AnnotationForImageOnTimePoint | ArbitraryAnnotation;
type BaseAnnotation = {
  index: number;
  id: string;
  type: string;
  comment: string;
  timestamp_from: number;
  timestamp_to: number;
  generation: number;
  instance_id?: string;
};

export type AnnotationForImageOnTimePoint = {
  type: AnnotationType;
  centerPoint: Point;
  targetTopic: string;
  generation: number;
  width?: number;
  height?: number;
  color?: string;
  frame_id: string;
} & BaseAnnotation;

export type ArbitraryAnnotation = {
  type: "arbitrary";
  targetTopic?: string;
  frame_id?: string;
} & BaseAnnotation;

export type interpolatedCoordinate = {
  centerPoint: Point;
  height?: number | undefined;
  width?: number | undefined;
};

export type InterpolatedAnnotation = {
  type: "interpolate";
  targetTopic: string;
  width?: number;
  height?: number;
  color?: string;
  frame_id: string;
  interpolateCoordinate: (currentTimeInNumber: number) => interpolatedCoordinate | undefined;
} & Omit<BaseAnnotation, "generation">;
