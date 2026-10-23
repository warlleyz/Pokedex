
import { useMemo, useState } from 'react'
import './PokemonCatalog.css'

const PAGE_SIZE = 8

const sortOptions = [
    ['id', 'Número'],
    ['name', 'Nome'],
    ['hp', 'HP'],
    ['attack', 'Ataque'],
    ['defense', 'Defesa'],
    ['specialAttack', 'Ataque especial'],
    ['specialDefense', 'Defesa especial'],
    ['speed', 'Velocidade'],
]

function readFavorites() {
    try {
        const stored = localStorage.getItem('pokedex-favorites')
            ?? localStorage.getItem('pokebox-favorites')
            ?? '[]'

        const parsed = JSON.parse(stored)

        return Array.isArray(parsed)
            ? parsed.filter(Number.isInteger)
            : []
    } catch {
        return []
    }
}

function PokemonCard({
    pokemon,
    isFavorite,
    onSelect,
    onToggleFavorite,
}) {
    const types = Array.isArray(pokemon.types)
        ? pokemon.types
        : []

    return (
        <article className="catalog-card">
            <div className="catalog-card-top">
                <span className="catalog-card-number">
                    #{String(pokemon.id).padStart(3, '0')}
                </span>

                <button
                    type="button"
                    className={`catalog-favorite ${isFavorite ? 'is-favorite' : ''}`}
                    aria-label={
                        isFavorite
                            ? `Remover ${pokemon.name} dos favoritos`
                            : `Adicionar ${pokemon.name} aos favoritos`
                    }
                    aria-pressed={isFavorite}
                    title={isFavorite ? 'Remover favorito' : 'Adicionar favorito'}
                    onClick={() => onToggleFavorite(pokemon.id)}
                >
                    {isFavorite ? '★' : '☆'}
                </button>
            </div>

            <button
                type="button"
                className="catalog-card-main"
                onClick={() => onSelect(pokemon)}
                aria-label={`Ver detalhes de ${pokemon.name}`}
            >
                <div className="catalog-artwork">
                    <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                        alt=""
                        loading="lazy"
                        onError={(event) => {
                            event.currentTarget.style.visibility = 'hidden'
                        }}
                    />
                </div>

                <strong className="catalog-card-name">
                    {pokemon.name}
                </strong>

                <div className="catalog-types">
                    {types.length ? (
                        types.map((type) => (
                            <span key={type.name}>
                                {type.name}
                            </span>
                        ))
                    ) : (
                        <span>Tipo desconhecido</span>
                    )}
                </div>
            </button>
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
    const [favorites, setFavorites] = useState(readFavorites)
    const [page, setPage] = useState(1)

    const typeNames = useMemo(() => {
        const names = types.length
            ? types.map((type) => type.name)
            : pokemon.flatMap((item) =>
                (item.types ?? []).map((type) => type.name)
            )

        return [...new Set(names.filter(Boolean))].sort()
    }, [pokemon, types])

    const results = useMemo(() => {
        const query = search.trim().toLocaleLowerCase('pt-BR')

        const filtered = pokemon.filter((item) => {
            const matchesSearch =
                !query ||
                item.name?.toLocaleLowerCase('pt-BR').includes(query) ||
                String(item.id) === query

            const matchesType =
                !selectedType ||
                item.types?.some((type) => type.name === selectedType)

            const matchesFavorite =
                !favoritesOnly || favorites.includes(item.id)

            return matchesSearch && matchesType && matchesFavorite
        })

        return [...filtered].sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name, 'pt-BR')
            }

            if (sortBy === 'id') {
                return a.id - b.id
            }

            return (
                (b.stats?.[sortBy] ?? -1) -
                (a.stats?.[sortBy] ?? -1) ||
                a.id - b.id
            )
        })
    }, [
        pokemon,
        search,
        selectedType,
        sortBy,
        favoritesOnly,
        favorites,
    ])

    const totalPages = Math.max(
        1,
        Math.ceil(results.length / PAGE_SIZE)
    )

    const currentPage = Math.min(page, totalPages)

    const visiblePokemon = results.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    )

    function updateFilter(setter, value) {
        setter(value)
        setPage(1)
    }

    function toggleFavorite(id) {
        setFavorites((current) => {
            const updated = current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]

            try {
                localStorage.setItem(
                    'pokedex-favorites',
                    JSON.stringify(updated)
                )
            } catch {
                // Favoritos continuam disponíveis durante a sessão.
            }

            return updated
        })
    }

    function clearFilters() {
        setSearch('')
        setSelectedType('')
        setSortBy('id')
        setFavoritesOnly(false)
        setPage(1)
    }

    return (
        <section className="pokemon-catalog" aria-label="Catálogo de Pokémon">
            <header className="catalog-header">
                <div>
                    <span className="catalog-eyebrow">
                        POKÉDEX / DATABASE
                    </span>
                    <h3>Explorar Pokémon</h3>
                </div>

                <span className="catalog-count">
                    {results.length} encontrados
                </span>
            </header>

            <div className="catalog-controls">
                <label className="catalog-search">
                    <span>Pesquisar</span>
                    <input
                        type="search"
                        placeholder="Nome ou número"
                        value={search}
                        onChange={(event) =>
                            updateFilter(setSearch, event.target.value)
                        }
                    />
                </label>

                <label>
                    <span>Tipo</span>
                    <select
                        value={selectedType}
                        onChange={(event) =>
                            updateFilter(setSelectedType, event.target.value)
                        }
                    >
                        <option value="">Todos os tipos</option>
                        {typeNames.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Ordenar por</span>
                    <select
                        value={sortBy}
                        onChange={(event) =>
                            updateFilter(setSortBy, event.target.value)
                        }
                    >
                        {sortOptions.map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="catalog-favorites-filter">
                    <input
                        type="checkbox"
                        checked={favoritesOnly}
                        onChange={(event) =>
                            updateFilter(setFavoritesOnly, event.target.checked)
                        }
                    />
                    <span>Favoritos</span>
                </label>
            </div>

            {results.length > 0 ? (
                <>
                    <div className="catalog-grid">
                        {visiblePokemon.map((item) => (
                            <PokemonCard
                                key={item.id}
                                pokemon={item}
                                isFavorite={favorites.includes(item.id)}
                                onToggleFavorite={toggleFavorite}
                                onSelect={onSelectPokemon}
                            />
                        ))}
                    </div>

                    <nav
                        className="catalog-pagination"
                        aria-label="Paginação dos Pokémon"
                    >
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setPage(currentPage - 1)}
                        >
                            ← Anterior
                        </button>

                        <span>
                            {currentPage} de {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setPage(currentPage + 1)}
                        >
                            Próxima →
                        </button>
                    </nav>
                </>
            ) : (
                <div className="catalog-empty" role="status">
                    <span aria-hidden="true">◇</span>
                    <h3>Nenhum Pokémon encontrado</h3>
                    <p>Experimente alterar os filtros ou a pesquisa.</p>

                    <button type="button" onClick={clearFilters}>
                        Limpar filtros
                    </button>
                </div>
            )}
        </section>
    )
}
