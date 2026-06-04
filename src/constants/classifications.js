export const LEGENDARY = new Set([
  'articuno', 'zapdos', 'moltres', 'mewtwo', 'raikou', 'entei', 'suicune',
  'lugia', 'ho-oh', 'regirock', 'regice', 'registeel', 'latias', 'latios',
  'kyogre', 'groudon', 'rayquaza', 'uxie', 'mesprit', 'azelf', 'dialga',
  'palkia', 'heatran', 'regigigas', 'giratina', 'cresselia', 'cobalion',
  'terrakion', 'virizion', 'tornadus', 'thundurus', 'reshiram', 'zekrom',
  'landorus', 'kyurem', 'xerneas', 'yveltal', 'zygarde', 'tapu-koko',
  'tapu-lele', 'tapu-bulu', 'tapu-fini', 'cosmog', 'cosmoem', 'solgaleo',
  'lunala', 'necrozma', 'zacian', 'zamazenta', 'eternatus', 'kubfu',
  'regieleki', 'regidrago', 'glastrier', 'spectrier', 'calyrex',
  'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu', 'koraidon', 'miraidon',
  'walking-wake', 'iron-leaves', 'ogerpon', 'terapagos',
])

export const MYTHICAL = new Set([
  'mew', 'celebi', 'jirachi', 'deoxys', 'phione', 'manaphy', 'darkrai',
  'shaymin', 'arceus', 'victini', 'keldeo', 'meloetta', 'genesect',
  'diancie', 'hoopa', 'volcanion', 'magearna', 'marshadow', 'poipole',
  'naganadel', 'stakataka', 'blacephalon', 'zeraora', 'meltan', 'melmetal',
  'zarude', 'pecharunt',
])

export const PSEUDO_LEGENDARY = new Set([
  'dragonite', 'tyranitar', 'salamence', 'metagross', 'garchomp',
  'hydreigon', 'goodra', 'kommo-o', 'dragapult', 'baxcalibur',
])

export function isLegendary(name) {
  return LEGENDARY.has(normalizeName(name))
}

export function isMythical(name) {
  return MYTHICAL.has(normalizeName(name))
}

export function isPseudoLegendary(name) {
  return PSEUDO_LEGENDARY.has(normalizeName(name))
}

function normalizeName(name) {
  return (name || '').toLowerCase().replace(/\s+/g, '-')
}
