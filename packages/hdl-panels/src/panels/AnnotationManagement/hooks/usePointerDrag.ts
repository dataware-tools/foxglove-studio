import { useState } from "react";
import { Point } from "../types";

export const usePointerDrag = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [clickStartPagePoint, setClickStartPagePoint] = useState<Point | null>(null);
  const [difference, setDifference] = useState<Point | null>(null);

  const handleDown = (e: React.PointerEvent<HTMLElement>) => {
    setClickStartPagePoint(new Point(e.pageX, e.pageY));
    setIsDragging(true);
    setDifference(null);
    e.stopPropagation();
    // Keep the pointer captured even if the mouse is moved outside of the element.
    // Reference: https://seiyab.hatenablog.com/entry/2020/10/10/224924
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging || !clickStartPagePoint) return;

    e.stopPropagation();

    const currentPagePoint = new Point(e.pageX, e.pageY);
    const difference = clickStartPagePoint.vectorToPoint(currentPagePoint);
    setDifference(difference);
  };

  const handleUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging || !clickStartPagePoint) return;
    setIsDragging(false);
    setClickStartPagePoint(null);
    e.stopPropagation();
    // Release pointer capture.
    // Reference: https://seiyab.hatenablog.com/entry/2020/10/10/224924
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return {
    isDragging,
    handleDown,
    handleMove,
    handleUp,
    difference,
  };
};
