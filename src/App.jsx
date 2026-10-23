
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
  { id: 'home', label: 'Início' },
  { id: 'pokemon', label: 'Pokémon' },
  { id: 'trainers', label: 'Treinadores' },
  { id: 'comparison', label: 'Comparador' },
]

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('pokedex-theme')
      ?? localStorage.getItem('pokebox-theme')

    return saved === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function Icon({ name }) {
  const icons = {
    pokemon: '◈',
    trainers: '◎',
    comparison: '⇄',
    home: '⌂',
  }

  return (
    <span aria-hidden="true" className="pd-icon">
      {icons[name] ?? '•'}
    </span>
  )
}

function HomeScreen({ onNavigate }) {
  return (
    <section className="pd-home" aria-labelledby="pd-home-title">
      <div className="pd-home-intro">
        <span className="pd-eyebrow">
          SISTEMA DE CONSULTA POKÉMON
        </span>

        <h2 id="pd-home-title">
          Seu universo Pokémon.
          <span> Em um só lugar.</span>
        </h2>

        <p>
          Explore a Pokédex, conheça treinadores e compare
          os atributos de diferentes Pokémon.
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
        <button
          className="pd-feature pd-feature-primary"
          type="button"
          onClick={() => onNavigate('pokemon')}
        >
          <span className="pd-feature-icon">
            <Icon name="pokemon" />
          </span>
          <span className="pd-feature-copy">
            <strong>Explorar Pokémon</strong>
            <small>
              Catálogo, pesquisa, filtros e favoritos
            </small>
          </span>
          <span className="pd-feature-arrow" aria-hidden="true">
            ↗
          </span>
        </button>

        <button
          className="pd-feature"
          type="button"
          onClick={() => onNavigate('trainers')}
        >
          <span className="pd-feature-icon">
            <Icon name="trainers" />
          </span>
          <span className="pd-feature-copy">
            <strong>Treinadores</strong>
            <small>Perfis, insígnias e equipes</small>
          </span>
          <span className="pd-feature-arrow" aria-hidden="true">
            ↗
          </span>
        </button>

        <button
          className="pd-feature"
          type="button"
          onClick={() => onNavigate('comparison')}
        >
          <span className="pd-feature-icon">
            <Icon name="comparison" />
          </span>
          <span className="pd-feature-copy">
            <strong>Comparador</strong>
            <small>Analise atributos lado a lado</small>
          </span>
          <span className="pd-feature-arrow" aria-hidden="true">
            ↗
          </span>
        </button>
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
      // A preferência permanece ativa durante a sessão.
    }
  }, [theme])

  const currentPage = navigation.find(
    (item) => item.id === page
  )

  function navigate(nextPage) {
    setSelectedPokemon(null)
    setPage(nextPage)
  }

  function openPokemon(item) {
    setSelectedPokemon(item)
    setPage('pokemon')
  }

  function toggleTheme() {
    setTheme((current) =>
      current === 'dark' ? 'light' : 'dark'
    )
  }

  function renderPage() {
    if (page === 'home') {
      return <HomeScreen onNavigate={navigate} />
    }

    if (page === 'pokemon') {
      if (selectedPokemon) {
        return (
          <PokemonDetails
            pokemon={selectedPokemon}
          />
        )
      }

      return (
        <PokemonCatalog
          pokemon={pokemon}
          types={types}
          onSelectPokemon={openPokemon}
        />
      )
    }

    if (page === 'trainers') {
      return (
        <TrainerList
          trainers={trainers}
          pokemon={pokemon}
        />
      )
    }

    if (page === 'comparison') {
      return <PokemonComparison pokemon={pokemon} />
    }

    return null
  }

  return (
    <div className="pd-environment">
      <main
        className="pd-device"
        aria-label="Dispositivo Pokédex"
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

          <span className="pd-model">MODEL PX-01</span>
        </header>

        <div className="pd-display-frame">
          <section
            className="pd-display"
            aria-label="Tela da Pokédex"
          >
            <div className="pd-systembar">
              <div className="pd-system-indicator">
                <span className="pd-status-dot" />
                <span>POKÉDEX OS</span>
              </div>

              <div className="pd-system-actions">
                <span className="pd-system-version">
                  SYSTEM ONLINE
                </span>

                <button
                  className="pd-theme-button"
                  type="button"
                  onClick={toggleTheme}
                  aria-label={
                    theme === 'dark'
                      ? 'Ativar tema claro'
                      : 'Ativar tema escuro'
                  }
                  aria-pressed={theme === 'light'}
                >
                  {theme === 'dark' ? '☀' : '☾'}
                </button>
              </div>
            </div>

            <div className="pd-navigation-row">
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
                    <Icon name={item.id} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {page !== 'home' && (
              <div className="pd-page-heading">
                <div>
                  <span className="pd-eyebrow">
                    POKÉDEX / {currentPage?.label.toUpperCase()}
                  </span>

                  <h2>
                    {selectedPokemon
                      ? selectedPokemon.name
                      : currentPage?.label}
                  </h2>
                </div>

                {selectedPokemon && (
                  <button
                    className="pd-back-button"
                    type="button"
                    onClick={() => setSelectedPokemon(null)}
                  >
                    ← Voltar ao catálogo
                  </button>
                )}
              </div>
            )}

            <div
              className={`pd-page-content ${page === 'home' ? 'pd-page-home' : ''
                }`}
            >
              {renderPage()}
            </div>

            <footer className="pd-display-footer">
              <span>POKÉDEX SYSTEM / 2026</span>
              <span>
                {page === 'home'
                  ? 'MENU PRINCIPAL'
                  : currentPage?.label.toUpperCase()}
              </span>
            </footer>
          </section>
        </div>

        <footer className="pd-hardware-footer">
          <div className="pd-speaker" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className="pd-hardware-description">
            <span className="pd-hardware-description-dot" />
            <span>POKÉDEX / DIGITAL DATABASE</span>
          </div>

          <button
            type="button"
            className="pd-home-control"
            onClick={() => navigate('home')}
            aria-label="Voltar à tela inicial"
            title="Tela inicial"
          >
            <Icon name="home" />
          </button>
        </footer>
      </main>
    </div>
  )
}

export default App