
import { useMemo, useState } from 'react'
import './PokemonCatalog.css'

const attributes = [
    ['hp', 'HP'],
    ['attack', 'Ataque'],
    ['defense', 'Defesa'],
    ['specialAttack', 'Ataque especial'],
    ['specialDefense', 'Defesa especial'],
    ['speed', 'Velocidade'],
]

const sortOptions = [
    ['id', 'Número'],
    ['name', 'Nome'],
    ...attributes.map(([key, name]) => [key, name]),
]

function getFavorites() {
    try {
        const stored = JSON.parse(localStorage.getItem('pokebox-favorites') || '[]')
        return Array.isArray(stored)
            ? stored.filter((id) => Number.isInteger(id))
            : []
    } catch {
        return []
    }
}

function PokemonCard({ pokemon, favorite, onFavorite, onSelect }) {
    const types = Array.isArray(pokemon.types) ? pokemon.types : []

    return (
        <article className="catalog-card">
            <div className="catalog-card-heading">
                <span>#{String(pokemon.id).padStart(3, '0')}</span>
                <button
                    type="button"
                    className="catalog-favorite"
                    aria-label={`${favorite ? 'Remover' : 'Adicionar'} ${pokemon.name} ${favorite ? 'dos' : 'aos'} favoritos`}
                    aria-pressed={favorite}
                    onClick={() => onFavorite(pokemon.id)}
                >
                    {favorite ? '★' : '☆'}
                </button>
            </div>

            <button
                type="button"
                className="catalog-card-main"
                onClick={() => onSelect(pokemon)}
                aria-label={`Visualizar detalhes de ${pokemon.name}`}
            >
                <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.style.visibility = 'hidden'
                    }}
                />
                <strong>{pokemon.name}</strong>
                <span className="catalog-types">
                    {types.length
                        ? types.map((type) => type.name).join(' / ')
                        : 'Tipo não informado'}
                </span>
            </button>

            <dl className="catalog-stats">
                {attributes.map(([key, label]) => (
                    <div key={key}>
                        <dt>{label}</dt>
                        <dd>{typeof pokemon.stats?.[key] === 'number'
                            ? pokemon.stats[key]
                            : '—'}</dd>
                    </div>
                ))}
            </dl>
        </article>
    )
}

export default function PokemonCatalog({
    pokemon = [],
    types = [],
    onSelectPokemon = () => { },
}) {
    const [search, setSearch] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [sortBy, setSortBy] = useState('id')
    const [favoritesOnly, setFavoritesOnly] = useState(false)
    const [favorites, setFavorites] = useState(getFavorites)
    const [page, setPage] = useState(1)

    const pageSize = 12

    const typeNames = useMemo(() => {
        const names = types.length
            ? types.map((type) => type.name)
            : pokemon.flatMap((item) =>
                (item.types || []).map((type) => type.name)
            )

        return [...new Set(names.filter(Boolean))].sort()
    }, [pokemon, types])

    const results = useMemo(() => {
        const query = search.trim().toLocaleLowerCase()
        const list = pokemon.filter((item) => {
            const matchesSearch = !query
                || item.name?.toLocaleLowerCase().includes(query)
                || String(item.id) === query

            const matchesType = !selectedType
                || item.types?.some((type) => type.name === selectedType)

            const matchesFavorite = !favoritesOnly
                || favorites.includes(item.id)

            return matchesSearch && matchesType && matchesFavorite
        })

        return [...list].sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name)
            }

            if (sortBy === 'id') return a.id - b.id

            return (b.stats?.[sortBy] ?? -1) -
                (a.stats?.[sortBy] ?? -1) || a.id - b.id
        })
    }, [pokemon, search, selectedType, sortBy, favoritesOnly, favorites])

    const totalPages = Math.max(1, Math.ceil(results.length / pageSize))
    const currentPage = Math.min(page, totalPages)
    const visible = results.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    function toggleFavorite(id) {
        setFavorites((previous) => {
            const next = previous.includes(id)
                ? previous.filter((favorite) => favorite !== id)
                : [...previous, id]

            try {
                localStorage.setItem('pokebox-favorites', JSON.stringify(next))
            } catch {
                // Permite continuar usando favoritos durante a sessão.
            }

            return next
        })
    }

    function resetPage(setter, value) {
        setter(value)
        setPage(1)
    }

    return (
        <section className="pokemon-catalog" aria-label="Catálogo de Pokémon">
            <header className="catalog-header">
                <div>
                    <span className="catalog-eyebrow">POKÉBOX DATABASE</span>
                    <h2>Catálogo Pokémon</h2>
                </div>
                <span className="catalog-count">{results.length} encontrados</span>
            </header>

            <div className="catalog-controls">
                <label>
                    <span>Pesquisar</span>
                    <input
                        type="search"
                        placeholder="Nome ou número..."
                        value={search}
                        onChange={(event) => resetPage(setSearch, event.target.value)}
                    />
                </label>

                <label>
                    <span>Tipo</span>
                    <select
                        value={selectedType}
                        onChange={(event) => resetPage(setSelectedType, event.target.value)}
                    >
                        <option value="">Todos os tipos</option>
                        {typeNames.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Ordenar</span>
                    <select
                        value={sortBy}
                        onChange={(event) => resetPage(setSortBy, event.target.value)}
                    >
                        {sortOptions.map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </label>

                <label className="catalog-favorites-filter">
                    <input
                        type="checkbox"
                        checked={favoritesOnly}
                        onChange={(event) =>
                            resetPage(setFavoritesOnly, event.target.checked)
                        }
                    />
                    Somente favoritos
                </label>
            </div>

            {results.length ? (
                <>
                    <div className="catalog-grid">
                        {visible.map((item) => (
                            <PokemonCard
                                key={item.id}
                                pokemon={item}
                                favorite={favorites.includes(item.id)}
                                onFavorite={toggleFavorite}
                                onSelect={onSelectPokemon}
                            />
                        ))}
                    </div>

                    <nav className="catalog-pagination" aria-label="Paginação">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setPage(currentPage - 1)}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setPage(currentPage + 1)}
                        >
                            Próxima
                        </button>
                    </nav>
                </>
            ) : (
                <div className="catalog-empty" role="status">
                    <h3>Nenhum Pokémon encontrado</h3>
                    <p>Experimente modificar a pesquisa ou os filtros.</p>
                </div>
            )}
        </section>
    )
}
