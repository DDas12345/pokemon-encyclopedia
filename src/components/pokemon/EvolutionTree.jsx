import { Link } from 'react-router-dom'
import { formatName } from '../../utils/pokemonHelpers'

function parseChain(chain) {
  if (!chain) return []
  const nodes = []
  function walk(node, depth = 0) {
    if (!node?.species) return
    const name = node.species.name
    const url = node.species.url || ''
    const id = parseInt(url.split('/').filter(Boolean).pop(), 10) || name
    const details = node.evolution_details?.[0]
    nodes.push({
      name,
      id,
      displayName: formatName(name),
      depth,
      minLevel: details?.min_level,
      trigger: details?.trigger?.name,
      item: details?.item?.name,
      heldItem: details?.held_item?.name,
      timeOfDay: details?.time_of_day,
      knownMove: details?.known_move?.name,
      location: details?.location?.name,
      minHappiness: details?.min_happiness,
      needsOverworldRain: details?.needs_overworld_rain,
    })
    if (node.evolves_to?.length) {
      for (const child of node.evolves_to) walk(child, depth + 1)
    }
  }
  walk(chain.chain)
  return nodes
}

function getEvolutionLabel(node) {
  const parts = []
  if (node.minLevel) parts.push(`Lv. ${node.minLevel}`)
  if (node.item) parts.push(formatName(node.item))
  if (node.trigger === 'trade') parts.push('Trade')
  if (node.heldItem) parts.push(`Trade w/ ${formatName(node.heldItem)}`)
  if (node.timeOfDay) parts.push(formatName(node.timeOfDay))
  if (node.knownMove) parts.push(`Knows ${formatName(node.knownMove)}`)
  if (node.location) parts.push(formatName(node.location))
  if (node.minHappiness) parts.push('High Friendship')
  if (node.needsOverworldRain) parts.push('Rain')
  if (!parts.length && node.trigger) parts.push(formatName(node.trigger))
  return parts.join(' · ') || 'Evolve'
}

export default function EvolutionTree({ evolutionChain, currentName }) {
  const nodes = parseChain(evolutionChain)
  if (!nodes.length) {
    return <p className="text-[var(--text-muted)]">This Pokémon does not evolve.</p>
  }

  const byDepth = {}
  nodes.forEach((n) => {
    if (!byDepth[n.depth]) byDepth[n.depth] = []
    byDepth[n.depth].push(n)
  })
  const depths = Object.keys(byDepth).map(Number).sort((a, b) => a - b)

  return (
    <div className="evolution-tree overflow-x-auto pb-4">
      <div className="flex min-w-max items-start gap-2">
        {depths.map((depth, di) => (
          <div key={depth} className="flex items-center gap-2">
            {di > 0 && <span className="evo-arrow text-2xl text-[var(--accent)]">→</span>}
            <div className={`flex flex-col gap-4 ${byDepth[depth].length > 1 ? 'branch' : ''}`}>
              {byDepth[depth].map((node) => (
                <div key={node.name} className="evo-node">
                  <Link
                    to={`/pokemon/${typeof node.id === 'number' ? node.id : node.name}`}
                    className={`evo-card ${node.name === currentName ? 'is-current' : ''}`}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${typeof node.id === 'number' ? node.id : 0}.png`}
                      alt={node.displayName}
                      onError={(e) => {
                        e.target.src = '/favicon.svg'
                      }}
                      className="h-20 w-20 object-contain"
                    />
                    <span className="font-semibold">{node.displayName}</span>
                  </Link>
                  {node.depth > 0 && (
                    <span className="evo-condition text-xs text-[var(--text-muted)]">
                      {getEvolutionLabel(node)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
