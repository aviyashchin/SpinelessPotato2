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

  // Fix: JSX tags cannot be expressions like corners[0].Icon. 
  // We must assign them to capitalized variables first.
  const TopLeftIcon = corners[0].Icon;
  const TopRightIcon = corners[1].Icon;
  const BottomLeftIcon = corners[2].Icon;
  const BottomRightIcon = corners[3].Icon;

  return (
    <>
      {/* Top Left */}
      <div className={`absolute top-0 left-0 p-3 pointer-events-none opacity-50`}>
        <TopLeftIcon className={`w-8 h-8 ${corners[0].color}`} />
        <div className={`absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-${corners[0].color.split('-')[1]}-900/20 to-transparent -z-10 rounded-br-3xl`} />
      </div>

      {/* Top Right */}
      <div className={`absolute top-0 right-0 p-3 pointer-events-none opacity-50`}>
        <TopRightIcon className={`w-8 h-8 ${corners[1].color}`} />
        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-${corners[1].color.split('-')[1]}-900/20 to-transparent -z-10 rounded-bl-3xl`} />
      </div>

      {/* Bottom Left */}
      <div className={`absolute bottom-0 left-0 p-3 pointer-events-none opacity-50`}>
        <BottomLeftIcon className={`w-8 h-8 ${corners[2].color}`} />
        <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-${corners[2].color.split('-')[1]}-900/20 to-transparent -z-10 rounded-tr-3xl`} />
      </div>

      {/* Bottom Right */}
      <div className={`absolute bottom-0 right-0 p-3 pointer-events-none opacity-50`}>
        <BottomRightIcon className={`w-8 h-8 ${corners[3].color}`} />
        <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-${corners[3].color.split('-')[1]}-900/20 to-transparent -z-10 rounded-tl-3xl`} />
      </div>
    </>
  );
};