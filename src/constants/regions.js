export const GENERATIONS = [
  { id: 1, name: 'Generation I', region: 'Kanto', range: [1, 151], color: '#ef4444' },
  { id: 2, name: 'Generation II', region: 'Johto', range: [152, 251], color: '#f59e0b' },
  { id: 3, name: 'Generation III', region: 'Hoenn', range: [252, 386], color: '#22c55e' },
  { id: 4, name: 'Generation IV', region: 'Sinnoh', range: [387, 493], color: '#3b82f6' },
  { id: 5, name: 'Generation V', region: 'Unova', range: [494, 649], color: '#8b5cf6' },
  { id: 6, name: 'Generation VI', region: 'Kalos', range: [650, 721], color: '#ec4899' },
  { id: 7, name: 'Generation VII', region: 'Alola', range: [722, 809], color: '#f97316' },
  { id: 8, name: 'Generation VIII', region: 'Galar', range: [810, 905], color: '#06b6d4' },
  { id: 9, name: 'Generation IX', region: 'Paldea', range: [906, 1025], color: '#a855f7' },
]

export const REGIONS = GENERATIONS.map((g) => ({
  id: g.region.toLowerCase(),
  name: g.region,
  generation: g.id,
  range: g.range,
  color: g.color,
  starters: getStarters(g.region),
  legendaries: getLegendaries(g.region),
  locations: getLocations(g.region),
}))

function getStarters(region) {
  const map = {
    Kanto: ['bulbasaur', 'charmander', 'squirtle'],
    Johto: ['chikorita', 'cyndaquil', 'totodile'],
    Hoenn: ['treecko', 'torchic', 'mudkip'],
    Sinnoh: ['turtwig', 'chimchar', 'piplup'],
    Unova: ['snivy', 'tepig', 'oshawott'],
    Kalos: ['chespin', 'fennekin', 'froakie'],
    Alola: ['rowlet', 'litten', 'popplio'],
    Galar: ['grookey', 'scorbunny', 'sobble'],
    Paldea: ['sprigatito', 'fuecoco', 'quaxly'],
  }
  return map[region] || []
}

function getLegendaries(region) {
  const map = {
    Kanto: ['articuno', 'zapdos', 'moltres', 'mewtwo', 'mew'],
    Johto: ['raikou', 'entei', 'suicune', 'lugia', 'ho-oh', 'celebi'],
    Hoenn: ['regirock', 'regice', 'registeel', 'latias', 'latios', 'kyogre', 'groudon', 'rayquaza', 'jirachi', 'deoxys'],
    Sinnoh: ['uxie', 'mesprit', 'azelf', 'dialga', 'palkia', 'heatran', 'regigigas', 'giratina', 'cresselia', 'phione', 'manaphy', 'darkrai', 'shaymin', 'arceus'],
    Unova: ['victini', 'cobalion', 'terrakion', 'virizion', 'tornadus', 'thundurus', 'reshiram', 'zekrom', 'landorus', 'kyurem', 'keldeo', 'meloetta', 'genesect'],
    Kalos: ['xerneas', 'yveltal', 'zygarde', 'diancie', 'hoopa', 'volcanion'],
    Alola: ['type-null', 'silvally', 'tapu-koko', 'tapu-lele', 'tapu-bulu', 'tapu-fini', 'cosmog', 'cosmoem', 'solgaleo', 'lunala', 'nihilego', 'buzzwole', 'pheromosa', 'xurkitree', 'celesteela', 'kartana', 'guzzlord', 'necrozma', 'magearna', 'marshadow', 'poipole', 'naganadel', 'stakataka', 'blacephalon', 'zeraora', 'meltan', 'melmetal'],
    Galar: ['zacian', 'zamazenta', 'eternatus', 'kubfu', 'urshifu', 'zarude', 'regieleki', 'regidrago', 'glastrier', 'spectrier', 'calyrex'],
    Paldea: ['wo-chien', 'chien-pao', 'ting-lu', 'chi-yu', 'koraidon', 'miraidon', 'walking-wake', 'iron-leaves', 'ogerpon', 'terapagos', 'pecharunt'],
  }
  return map[region] || []
}

function getLocations(region) {
  const map = {
    Kanto: ['Pallet Town', 'Viridian Forest', 'Mt. Moon', 'Cerulean Cave', 'Indigo Plateau'],
    Johto: ['New Bark Town', 'Bell Tower', 'Lake of Rage', 'Mt. Silver'],
    Hoenn: ['Littleroot Town', 'Petalburg Woods', 'Mt. Pyre', 'Sky Pillar'],
    Sinnoh: ['Twinleaf Town', 'Eterna Forest', 'Mt. Coronet', 'Spear Pillar'],
    Unova: ['Nuvema Town', 'Dreamyard', 'Dragonspiral Tower', 'Victory Road'],
    Kalos: ['Aquacorde Town', 'Santalune Forest', 'Parfum Palace', 'Terminus Cave'],
    Alola: ['Iki Town', 'Melemele Meadow', 'Mount Lanakila', 'Altar of the Sunne/Moone'],
    Galar: ['Postwick', 'Wild Area', 'Hammerlocke Hills', 'Crown Tundra'],
    Paldea: ['Cabo Poco', 'Mesagoza', 'Area Zero', 'The Great Crater of Paldea'],
  }
  return map[region] || []
}

export function getGenerationFromId(id) {
  const n = typeof id === 'string' ? parseInt(id, 10) : id
  if (Number.isNaN(n)) return null
  return GENERATIONS.find((g) => n >= g.range[0] && n <= g.range[1]) || null
}

export function getRegionFromId(id) {
  const gen = getGenerationFromId(id)
  return gen?.region || null
}
