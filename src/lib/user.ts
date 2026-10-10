export const USER = {
  name: 'Ibeh Chidera',
  email: 'ibehchristian819@gmail.com',
  avatar: 'public/new.pro.png',
  tier: 'Citigold Client',
  memberSince: '2026',
  rewardsPoints: 200,
};

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
