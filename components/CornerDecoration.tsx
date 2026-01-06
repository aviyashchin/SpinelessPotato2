import React, { useMemo } from 'react';
import { getRandomElements } from '../constants';

interface CornerDecorationProps {
  seed: number; // Used to stable-randomize the icons per question
}

export const CornerDecoration: React.FC<CornerDecorationProps> = ({ seed }) => {
  // Memoize random selection so it doesn't flicker on re-renders, but changes per question ID
  const corners = useMemo(() => {
    // We want 4 unique elements
    return getRandomElements(4);
  }, [seed]);

  const TopLeftIcon = corners[0].Icon;
  const TopRightIcon = corners[1].Icon;
  const BottomLeftIcon = corners[2].Icon;
  const BottomRightIcon = corners[3].Icon;

  return (
    <>
      {/* Top Left */}
      <div className={`absolute top-0 left-0 p-3 pointer-events-none opacity-50`}>
        <TopLeftIcon className={`w-8 h-8 ${corners[0].color}`} />
        <div 
          className="absolute top-0 left-0 w-24 h-24 -z-10 rounded-br-full opacity-20"
          style={{ background: `radial-gradient(circle at top left, ${corners[0].hex}, transparent)` }} 
        />
      </div>

      {/* Top Right */}
      <div className={`absolute top-0 right-0 p-3 pointer-events-none opacity-50`}>
        <TopRightIcon className={`w-8 h-8 ${corners[1].color}`} />
        <div 
          className="absolute top-0 right-0 w-24 h-24 -z-10 rounded-bl-full opacity-20"
          style={{ background: `radial-gradient(circle at top right, ${corners[1].hex}, transparent)` }}
        />
      </div>

      {/* Bottom Left */}
      <div className={`absolute bottom-0 left-0 p-3 pointer-events-none opacity-50`}>
        <BottomLeftIcon className={`w-8 h-8 ${corners[2].color}`} />
        <div 
          className="absolute bottom-0 left-0 w-24 h-24 -z-10 rounded-tr-full opacity-20"
          style={{ background: `radial-gradient(circle at bottom left, ${corners[2].hex}, transparent)` }}
        />
      </div>

      {/* Bottom Right */}
      <div className={`absolute bottom-0 right-0 p-3 pointer-events-none opacity-50`}>
        <BottomRightIcon className={`w-8 h-8 ${corners[3].color}`} />
        <div 
          className="absolute bottom-0 right-0 w-24 h-24 -z-10 rounded-tl-full opacity-20"
          style={{ background: `radial-gradient(circle at bottom right, ${corners[3].hex}, transparent)` }}
        />
      </div>
    </>
  );
};
