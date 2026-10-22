
import { useEffect, useState } from 'react'
import './App.css'

const stats = [
  { label: 'HP', value: 45 },
  { label: 'ATK', value: 49 },
  { label: 'DEF', value: 49 },
  { label: 'SP.ATK', value: 65 },
  { label: 'SP.DEF', value: 65 },
  { label: 'SPD', value: 45 },
]

const slots = Array.from({ length: 12 }, (_, index) => index + 1)

function getInitialTheme() {
  try {
    return localStorage.getItem('pokebox-theme') === 'light'
      ? 'light'
      : 'dark'
  } catch {
    return 'dark'
  }
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme

    try {
      localStorage.setItem('pokebox-theme', theme)
    } catch {
      // O tema continua funcional sem armazenamento.
    }
  }, [theme])

  function toggleTheme() {
    setTheme((current) => current === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">
            <span />
          </div>
          <div>
            <span className="brand-overline">POKÉMON MANAGEMENT SYSTEM</span>
            <h1>POKÉ<span>BOX</span></h1>
          </div>
        </div>

        <div className="header-actions">
          <div className="system-status">
            <span className="online-dot" />
            <span>SYSTEM ONLINE</span>
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark'
                ? 'Ativar tema claro'
                : 'Ativar tema escuro'
            }
            aria-pressed={theme === 'light'}
            title="Alternar tema"
          >
            <span aria-hidden="true">
              {theme === 'dark' ? '☀' : '☾'}
            </span>
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      <main className="device" aria-label="Interface PokéBox">
        <section className="device-half device-left">
          <div className="module-header">
            <div className="module-identity">
              <span className="module-label">POKÉMON DATABASE</span>
              <strong className="module-title">BULBASAUR</strong>
            </div>
            <span className="pokemon-number">#001</span>
          </div>

          <div className="screen pokemon-screen">
            <div className="screen-topline">
              <span>POKÉMON VIEWER</span>
              <span>GEN 01</span>
            </div>

            <div className="pokemon-stage">
              <div className="stage-ring stage-ring-outer" />
              <div className="stage-ring stage-ring-inner" />
              <div className="stage-crosshair stage-crosshair-x" />
              <div className="stage-crosshair stage-crosshair-y" />
              <img
                className="pokemon-image"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
                alt="Bulbasaur"
              />
              <div className="stage-ground" />
            </div>

            <div className="screen-bottomline">
              <span>SPECIMEN 001</span>
              <span className="live-marker">● PREVIEW</span>
            </div>
          </div>

          <div className="specimen-toolbar">
            <div className="status-lights" aria-label="Indicadores decorativos">
              <span />
              <span />
              <span />
            </div>
            <span className="toolbar-title">SPECIMEN PROFILE</span>
            <span className="toolbar-chip">NORMAL</span>
          </div>

          <div className="screen description-screen">
            <div className="section-label">
              <span>DATABASE ENTRY</span>
              <span>001 / KANTO</span>
            </div>
            <p>
              A strange seed was planted on its back at birth.
              The plant sprouts and grows with this Pokémon.
            </p>
          </div>

          <div className="panel-bottom">
            <span>POKÉBOX / TERMINAL 01</span>
            <span>DATABASE PREVIEW</span>
          </div>
        </section>

        <div className="device-spine" aria-hidden="true">
          <span className="spine-joint" />
          <span className="spine-light" />
          <span className="spine-joint" />
        </div>

        <section className="device-half device-right">
          <div className="right-header">
            <div>
              <span className="module-label">POKÉBOX / ANALYTICS</span>
              <h2>Pokémon Overview</h2>
            </div>
            <span className="right-header-mark">PKB-01</span>
          </div>

          <div className="right-top">
            <div className="screen stat-screen">
              <div className="section-label">
                <span>BASE STATISTICS</span>
                <span>BST 318</span>
              </div>

              <div className="stat-list">
                {stats.map((stat) => (
                  <div className="stat-row" key={stat.label}>
                    <span className="stat-name">{stat.label}</span>
                    <div className="stat-track">
                      <span style={{ width: `${stat.value / 255 * 100}%` }} />
                    </div>
                    <strong>{stat.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="screen type-screen">
              <div className="section-label">
                <span>ELEMENT TYPE</span>
              </div>
              <div className="type-list">
                <span className="type-badge grass">GRASS</span>
                <span className="type-badge poison">POISON</span>
              </div>
              <div className="type-footer">DUAL TYPE</div>
            </div>
          </div>

          <div className="box-section">
            <div className="section-label">
              <span>STORAGE SYSTEM</span>
              <span className="box-label">BOX 01 / PREVIEW</span>
            </div>

            <div className="storage-grid">
              {slots.map((slot) => (
                <div className="storage-slot" key={slot}>
                  <span className="slot-number">
                    {String(slot).padStart(2, '0')}
                  </span>
                  <span className="slot-symbol" aria-hidden="true">◇</span>
                </div>
              ))}
            </div>
          </div>

          <div className="screen info-screen">
            <div className="section-label">
              <span>DATABASE MODULES</span>
              <span>PREVIEW</span>
            </div>

            <div className="modules-grid">
              <div className="module-item">
                <span>01</span>
                <strong>Pokédex</strong>
                <small>Catálogo</small>
              </div>
              <div className="module-item">
                <span>02</span>
                <strong>Trainers</strong>
                <small>Treinadores</small>
              </div>
              <div className="module-item">
                <span>03</span>
                <strong>Compare</strong>
                <small>Comparação</small>
              </div>
            </div>
          </div>

          <div className="hardware-footer">
            <div className="hardware-orb" aria-hidden="true" />
            <div className="hardware-center">
              <span>POKÉBOX SYSTEM</span>
              <div className="hardware-leds">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="hardware-orb" aria-hidden="true" />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span>POKÉBOX © 2026</span>
        <span>POWERED BY REACT + VITE</span>
      </footer>
    </div>
  )
}

export default App
