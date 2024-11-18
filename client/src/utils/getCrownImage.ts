import crownFirst from '@/assets/crown-first.png';

export default function getCrownImage(rank: 0 | 1 | 2) {
  const crownImages = {
    0: crownFirst,
    1: crownFirst,
    2: crownFirst,
  };
  return crownImages[rank];
}
