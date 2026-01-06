import { 
  Moon, Sun, Clock, Hexagon, Ghost, Sparkles, Binary, 
  Anchor, CloudFog, Scissors, Zap, Disc, Orbit, Eye, 
  Hourglass, Link, Shield, Box, Triangle, CircleDashed,
  Infinity, Gem, Droplet, Flame, Snowflake, Wind, Mountain,
  Cpu, Database, Radio, Layers, Command, Fingerprint, 
  Network, Code, Microscope, Telescope, Compass
} from 'lucide-react';

export const ELEMENT_THEMES = [
  { name: 'Shadow', color: 'text-purple-500', hex: '#a855f7', Icon: Moon },
  { name: 'Light', color: 'text-orange-200', hex: '#fed7aa', Icon: Sun },
  { name: 'Time', color: 'text-emerald-300', hex: '#6ee7b7', Icon: Clock },
  { name: 'Metal', color: 'text-slate-400', hex: '#94a3b8', Icon: Hexagon },
  { name: 'Spirit', color: 'text-indigo-400', hex: '#818cf8', Icon: Ghost },
  { name: 'Aether', color: 'text-fuchsia-400', hex: '#e879f9', Icon: Sparkles },
  { name: 'Void', color: 'text-gray-600', hex: '#4b5563', Icon: Binary },
  { name: 'Smoke', color: 'text-stone-400', hex: '#a8a29e', Icon: CloudFog },
  { name: 'Sand', color: 'text-yellow-600', hex: '#ca8a04', Icon: Hourglass }, 
  { name: 'Steel', color: 'text-zinc-300', hex: '#d4d4d8', Icon: Scissors },
  { name: 'Energy', color: 'text-yellow-400', hex: '#facc15', Icon: Zap },
  { name: 'Glass', color: 'text-cyan-100', hex: '#cffafe', Icon: Disc },
  { name: 'Space', color: 'text-blue-900', hex: '#1e3a8a', Icon: Orbit },
  { name: 'Truth', color: 'text-rose-900', hex: '#881337', Icon: Eye },
  { name: 'Gravity', color: 'text-violet-800', hex: '#5b21b6', Icon: Anchor },
  { name: 'Rust', color: 'text-orange-700', hex: '#c2410c', Icon: Link },
  { name: 'Iron', color: 'text-stone-500', hex: '#78716c', Icon: Shield },
  { name: 'Matter', color: 'text-teal-700', hex: '#0f766e', Icon: Box },
  { name: 'Prism', color: 'text-pink-300', hex: '#f9a8d4', Icon: Triangle },
  { name: 'Silence', color: 'text-neutral-500', hex: '#737373', Icon: CircleDashed },
  { name: 'Chaos', color: 'text-red-500', hex: '#ef4444', Icon: Infinity },
  { name: 'Obsidian', color: 'text-neutral-800', hex: '#262626', Icon: Gem },
  { name: 'Mercury', color: 'text-slate-300', hex: '#cbd5e1', Icon: Droplet },
  { name: 'Ash', color: 'text-gray-500', hex: '#6b7280', Icon: Wind },
  { name: 'Echo', color: 'text-blue-300', hex: '#93c5fd', Icon: Radio },
  { name: 'Neon', color: 'text-lime-400', hex: '#a3e635', Icon: Cpu },
  { name: 'Cyber', color: 'text-sky-500', hex: '#0ea5e9', Icon: Network },
  { name: 'Logic', color: 'text-indigo-600', hex: '#4f46e5', Icon: Code },
  { name: 'Dust', color: 'text-yellow-800', hex: '#854d0e', Icon: Layers },
  { name: 'Order', color: 'text-white', hex: '#ffffff', Icon: Command },
];

export const getRandomElements = (count: number) => {
  const shuffled = [...ELEMENT_THEMES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
