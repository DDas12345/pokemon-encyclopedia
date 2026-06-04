import { TYPE_COLORS } from '../../constants/types'
import { formatName } from '../../utils/pokemonHelpers'

export default function TypeBadge({ type, size = 'md' }) {
  const color = TYPE_COLORS[type] || '#888'
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1', lg: 'text-base px-4 py-1.5' }
  return (
    <span
      className={`inline-block rounded-full font-semibold text-white shadow-sm ${sizes[size]}`}
      style={{ backgroundColor: color, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
    >
      {formatName(type)}
    </span>
  )
}
