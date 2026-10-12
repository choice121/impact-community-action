import React, { useState, useRef } from 'react';
import { IKImage } from '../common/IKImage';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before Support',
  afterLabel = 'After ICA Intervention',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl cursor-ew-resize aspect-[16/9] ${className}`}
      onMouseDown={() => (isDragging.current = true)}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Full background) */}
      <div className="absolute inset-0 w-full h-full">
        <IKImage path={afterImage} alt={afterLabel} className="w-full h-full" />
        <span className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-black/70 text-white text-xs font-semibold rounded-lg backdrop-blur-md">
          {afterLabel}
        </span>
      </div>

      {/* Before Image (Clipped overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="w-full h-full relative" style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}>
          <IKImage path={beforeImage} alt={beforeLabel} className="w-full h-full" />
        </div>
        <span className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-black/70 text-white text-xs font-semibold rounded-lg backdrop-blur-md">
          {beforeLabel}
        </span>
      </div>

      {/* Divider Line & Drag Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-[#0B2545] shadow-xl flex items-center justify-center font-bold text-xs border border-slate-200">
          ↔
        </div>
      </div>
    </div>
  );
};
