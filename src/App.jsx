
import { useEffect, useState } from 'react'
import PokemonCatalog from './components/catalog/PokemonCatalog.jsx'
import PokemonDetails from './components/details/PokemonDetails.jsx'
import TrainerList from './components/trainers/TrainerList.jsx'
import PokemonComparison from './components/comparison/PokemonComparison.jsx'
import pokedexData from './data/pokedex-data.json'
import './App.css'

const pokemon = Array.isArray(pokedexData.pokemon)
  ? pokedexData.pokemon
  : []

const trainers = Array.isArray(pokedexData.trainers)
  ? pokedexData.trainers
  : []

const types = Array.isArray(pokedexData.types)
  ? pokedexData.types
  : []

const navigation = [
  { id: 'home', label: 'Início', icon: 'home' },
  { id: 'pokemon', label: 'Pokémon', icon: 'pokemon' },
  { id: 'trainers', label: 'Treinadores', icon: 'trainers' },
  { id: 'comparison', label: 'Comparador', icon: 'comparison' },
]

function getInitialTheme() {
  try {
    const saved =
      localStorage.getItem('pokedex-theme') ??
      localStorage.getItem('pokebox-theme')

    return saved === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function Icon({ name }) {
  const icons = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-7h6v7" />
      </>
    ),
    pokemon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    trainers: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c0-4 3-7 7-7s7 3 7 7" />
        <circle cx="12" cy="12" r="10" />
      </>
    ),
    comparison: (
      <>
        <path d="M4 7h16" />
        <path d="m16 3 4 4-4 4" />
        <path d="M20 17H4" />
        <path d="m8 13-4 4 4 4" />
      </>
    ),
    theme: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M19.07 4.93l-1.42 1.42M6.35 17.65l-1.42 1.42" />
      </>
    ),
    moon: (
      <path d="M20.5 14.5A9 9 0 0 1 9.5 3.5 9 9 0 1 0 20.5 14.5Z" />
    ),
    back: (
      <>
        <path d="m12 19-7-7 7-7" />
        <path d="M5 12h14" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] ?? icons.pokemon}
    </svg>
  )
}

function HomeScreen({ onNavigate }) {
  const features = [
    {
      id: 'pokemon',
      title: 'Explorar Pokémon',
      description: 'Catálogo, pesquisa, filtros e favoritos',
    },
    {
      id: 'trainers',
      title: 'Treinadores',
      description: 'Perfis, insígnias e equipes',
    },
    {
      id: 'comparison',
      title: 'Comparador',
      description: 'Compare os atributos de dois Pokémon',
    },
  ]

  return (
    <section className="pd-home" aria-labelledby="pd-home-title">
      <div className="pd-home-intro">
        <span className="pd-eyebrow">
          SUA JORNADA COMEÇA AQUI
        </span>

        <h2 id="pd-home-title">
          Explore o universo
          <span> Pokémon.</span>
        </h2>

        <p>
          Consulte espécies, conheça treinadores e compare
          atributos em um único dispositivo.
        </p>

        <div className="pd-home-summary">
          <div>
            <strong>{pokemon.length}</strong>
            <span>Pokémon</span>
          </div>

          <div>
            <strong>{trainers.length}</strong>
            <span>Treinadores</span>
          </div>
        </div>
      </div>

      <div className="pd-home-features">
        {features.map((feature, index) => (
          <button
            key={feature.id}
            type="button"
            className={`pd-feature ${index === 0 ? 'pd-feature-primary' : ''
              }`}
            onClick={() => onNavigate(feature.id)}
          >
            <span className="pd-feature-icon">
              <Icon name={feature.id} />
            </span>

            <span className="pd-feature-copy">
              <strong>{feature.title}</strong>
              <small>{feature.description}</small>
            </span>

            <span
              className="pd-feature-arrow"
              aria-hidden="true"
            >
              <Icon name="arrow" />
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const [page, setPage] = useState('home')
  const [selectedPokemon, setSelectedPokemon] = useState(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme

    try {
      localStorage.setItem('pokedex-theme', theme)
    } catch {
      // O tema continua ativo durante a sessão.
    }
  }, [theme])

  function navigate(nextPage) {
    setSelectedPokemon(null)
    setPage(nextPage)
  }

  function openPokemon(item) {
    setSelectedPokemon(item)
    setPage('pokemon')
  }

  function goBack() {
    if (selectedPokemon) {
      setSelectedPokemon(null)
      return
    }

    navigate('home')
  }

  function toggleTheme() {
    setTheme((current) =>
      current === 'dark' ? 'light' : 'dark'
    )
  }

  function renderPage() {
    switch (page) {
      case 'home':
        return <HomeScreen onNavigate={navigate} />

      case 'pokemon':
        return selectedPokemon ? (
          <PokemonDetails pokemon={selectedPokemon} />
        ) : (
          <PokemonCatalog
            pokemon={pokemon}
            types={types}
            onSelectPokemon={openPokemon}
          />
        )

      case 'trainers':
        return (
          <TrainerList
            trainers={trainers}
            pokemon={pokemon}
          />
        )

      case 'comparison':
        return <PokemonComparison pokemon={pokemon} />

      default:
        return <HomeScreen onNavigate={navigate} />
    }
  }

  return (
    <div className="pd-environment">
      <main
        className="pd-device"
        aria-label="Pokédex interativa"
      >
        <header className="pd-hardware-header">
          <div className="pd-hardware-lights" aria-hidden="true">
            <span className="pd-light-main" />
            <span className="pd-light pd-light-red" />
            <span className="pd-light pd-light-yellow" />
            <span className="pd-light pd-light-green" />
          </div>

          <div className="pd-brand">
            <span>POKÉMON DATABASE SYSTEM</span>
            <h1>POKÉDEX</h1>
          </div>

          <span className="pd-model">PX-01</span>
        </header>

        <div className="pd-display-frame">
          <section
            className="pd-display"
            aria-label="Tela da Pokédex"
          >
            <nav
              className="pd-navigation"
              aria-label="Navegação principal"
            >
              {navigation.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    page === item.id
                      ? 'pd-navigation-active'
                      : ''
                  }
                  aria-current={
                    page === item.id ? 'page' : undefined
                  }
                  onClick={() => navigate(item.id)}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div
              className={`pd-page-content ${page === 'home' ? 'pd-page-home' : ''
                }`}
            >
              {renderPage()}
            </div>
          </section>
        </div>

        <footer className="pd-hardware-footer">
          <div className="pd-speaker" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className="pd-physical-controls">
            {page !== 'home' && (
              <button
                type="button"
                className="pd-physical-button"
                onClick={goBack}
                aria-label={
                  selectedPokemon
                    ? 'Voltar ao catálogo'
                    : 'Voltar ao início'
                }
                title={
                  selectedPokemon
                    ? 'Voltar ao catálogo'
                    : 'Voltar ao início'
                }
              >
                <Icon name={selectedPokemon ? 'back' : 'home'} />
              </button>
            )}

            <button
              type="button"
              className="pd-physical-button pd-theme-control"
              onClick={toggleTheme}
              aria-label={
                theme === 'dark'
                  ? 'Ativar tema claro'
                  : 'Ativar tema escuro'
              }
              aria-pressed={theme === 'light'}
              title="Alternar tema"
            >
              <Icon name={theme === 'dark' ? 'theme' : 'moon'} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
