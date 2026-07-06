const TEAM_FLAGS = {
  Argentina: '🇦🇷',
  Australia: '🇦🇺',
  Belgium: '🇧🇪',
  Brazil: '🇧🇷',
  Cameroon: '🇨🇲',
  Canada: '🇨🇦',
  'Costa Rica': '🇨🇷',
  Croatia: '🇭🇷',
  Denmark: '🇩🇰',
  Ecuador: '🇪🇨',
  England: '🏴',
  France: '🇫🇷',
  Germany: '🇩🇪',
  Ghana: '🇬🇭',
  Iran: '🇮🇷',
  Japan: '🇯🇵',
  Mexico: '🇲🇽',
  Morocco: '🇲🇦',
  Netherlands: '🇳🇱',
  Poland: '🇵🇱',
  Portugal: '🇵🇹',
  Qatar: '🇶🇦',
  'Saudi Arabia': '🇸🇦',
  Senegal: '🇸🇳',
  Serbia: '🇷🇸',
  'South Korea': '🇰🇷',
  Spain: '🇪🇸',
  Switzerland: '🇨🇭',
  Tunisia: '🇹🇳',
  Uruguay: '🇺🇾',
  USA: '🇺🇸',
  Wales: '🏴',
};

const TEAM_ALIASES = {
  'Korea Republic': 'South Korea',
  'United States': 'USA',
  'United States of America': 'USA',
};

export function getTeamFlag(teamName, storedFlag) {
  if (storedFlag && storedFlag !== '-') return storedFlag;
  const canonicalName = TEAM_ALIASES[teamName] ?? teamName;
  return TEAM_FLAGS[canonicalName] ?? '⚽';
}
