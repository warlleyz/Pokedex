export const STAT_FIELDS = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Attack' },
  { key: 'defense', label: 'Defense' },
  { key: 'specialAttack', label: 'Special Attack' },
  { key: 'specialDefense', label: 'Special Defense' },
  { key: 'speed', label: 'Speed' },
]

export function isStat(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

export function statWidth(value) {
  return isStat(value) ? `${Math.min(value / 255, 1) * 100}%` : '0%'
}

export function pokemonName(pokemon) {
  return typeof pokemon?.name === 'string' && pokemon.name.trim()
    ? pokemon.name
    : 'Nome não informado'
}

export function pokemonNumber(id) {
  return Number.isInteger(id) && id > 0
    ? `#${String(id).padStart(3, '0')}`
    : 'ID não informado'
}

export function selectablePokemon(pokemon) {
  return Array.isArray(pokemon)
    ? pokemon.filter((item) => item && Number.isInteger(item.id) && item.id > 0)
    : []
}
