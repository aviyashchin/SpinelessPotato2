import { 
  Flame, Droplets, Wind, Mountain, Zap, Moon, Sun, 
  Clock, Hexagon, Ghost, Sparkles, Binary, 
  Anchor, CloudFog, Gem, Scissors
} from 'lucide-react';

export const ELEMENT_THEMES = [
  { name: 'Fire', color: 'text-red-500', borderColor: 'border-red-500/30', Icon: Flame },
  { name: 'Water', color: 'text-blue-500', borderColor: 'border-blue-500/30', Icon: Droplets },
  { name: 'Wind', color: 'text-teal-400', borderColor: 'border-teal-400/30', Icon: Wind },
  { name: 'Earth', color: 'text-amber-600', borderColor: 'border-amber-600/30', Icon: Mountain },
  { name: 'Lightning', color: 'text-yellow-400', borderColor: 'border-yellow-400/30', Icon: Zap },
  { name: 'Shadow', color: 'text-purple-500', borderColor: 'border-purple-500/30', Icon: Moon },
  { name: 'Light', color: 'text-orange-200', borderColor: 'border-orange-200/30', Icon: Sun },
  { name: 'Time', color: 'text-emerald-300', borderColor: 'border-emerald-300/30', Icon: Clock },
  { name: 'Metal', color: 'text-slate-400', borderColor: 'border-slate-400/30', Icon: Hexagon },
  { name: 'Spirit', color: 'text-indigo-400', borderColor: 'border-indigo-400/30', Icon: Ghost },
  { name: 'Magic', color: 'text-fuchsia-400', borderColor: 'border-fuchsia-400/30', Icon: Sparkles },
  { name: 'Void', color: 'text-gray-600', borderColor: 'border-gray-600/30', Icon: Binary },
  { name: 'Ice', color: 'text-cyan-200', borderColor: 'border-cyan-200/30', Icon: Gem },
  { name: 'Smoke', color: 'text-gray-400', borderColor: 'border-gray-400/30', Icon: CloudFog },
  { name: 'Sand', color: 'text-yellow-600', borderColor: 'border-yellow-600/30', Icon: Anchor }, // Abstract
  { name: 'Steel', color: 'text-zinc-300', borderColor: 'border-zinc-300/30', Icon: Scissors },
];

export const getRandomElements = (count: number) => {
  const shuffled = [...ELEMENT_THEMES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};