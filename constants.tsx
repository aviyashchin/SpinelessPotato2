import { 
  Moon, Sun, Clock, Hexagon, Ghost, Sparkles, Binary, 
  Anchor, CloudFog, Scissors, Zap, Disc, Orbit, Eye, 
  Hourglass, Link, Shield, Box
} from 'lucide-react';

export const ELEMENT_THEMES = [
  { name: 'Shadow', color: 'text-purple-500', borderColor: 'border-purple-500/30', Icon: Moon },
  { name: 'Light', color: 'text-orange-200', borderColor: 'border-orange-200/30', Icon: Sun },
  { name: 'Time', color: 'text-emerald-300', borderColor: 'border-emerald-300/30', Icon: Clock },
  { name: 'Metal', color: 'text-slate-400', borderColor: 'border-slate-400/30', Icon: Hexagon },
  { name: 'Spirit', color: 'text-indigo-400', borderColor: 'border-indigo-400/30', Icon: Ghost },
  { name: 'Aether', color: 'text-fuchsia-400', borderColor: 'border-fuchsia-400/30', Icon: Sparkles },
  { name: 'Void', color: 'text-gray-600', borderColor: 'border-gray-600/30', Icon: Binary },
  { name: 'Smoke', color: 'text-gray-400', borderColor: 'border-gray-400/30', Icon: CloudFog },
  { name: 'Sand', color: 'text-yellow-600', borderColor: 'border-yellow-600/30', Icon: Hourglass }, 
  { name: 'Steel', color: 'text-zinc-300', borderColor: 'border-zinc-300/30', Icon: Scissors },
  { name: 'Energy', color: 'text-yellow-400', borderColor: 'border-yellow-400/30', Icon: Zap },
  { name: 'Glass', color: 'text-cyan-100', borderColor: 'border-cyan-100/30', Icon: Disc },
  { name: 'Space', color: 'text-blue-900', borderColor: 'border-blue-900/30', Icon: Orbit },
  { name: 'Truth', color: 'text-rose-900', borderColor: 'border-rose-900/30', Icon: Eye },
  { name: 'Gravity', color: 'text-violet-800', borderColor: 'border-violet-800/30', Icon: Anchor },
  { name: 'Rust', color: 'text-orange-700', borderColor: 'border-orange-700/30', Icon: Link },
  { name: 'Iron', color: 'text-stone-500', borderColor: 'border-stone-500/30', Icon: Shield },
  { name: 'Matter', color: 'text-teal-700', borderColor: 'border-teal-700/30', Icon: Box },
];

export const getRandomElements = (count: number) => {
  const shuffled = [...ELEMENT_THEMES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};