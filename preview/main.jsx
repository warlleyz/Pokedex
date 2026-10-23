import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import PokemonDetails from '../src/components/details/PokemonDetails.jsx'
import data from './pokedex-data.json'
import '../src/index.css'
import './preview.css'

function initialTheme() {
  try {
    return localStorage.getItem('pokebox-theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export default function ModulesPreview() {
  const [theme, setTheme] = useState(initialTheme)
  const [selectedId, setSelectedId] = useState('1')
  const selectedPokemon = data.pokemon.find((item) => String(item.id) === selectedId)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('pokebox-theme', theme)
    } catch { /* A prévia também funciona sem armazenamento. */ }
  }, [theme])

  return (
    <div className="pk-preview">
      <header className="pk-preview-header">
        <div>
          <span className="pk-preview-overline">POKÉMON MANAGEMENT SYSTEM</span>
          <h1>POKÉ<span>BOX</span></h1>
        </div>
        <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-pressed={theme === 'light'}>
          {theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        </button>
      </header>
      <main className="pk-preview-device">
        <section className="pk-preview-panel">
          <h2>Detalhes do Pokémon</h2>
          <label className="pk-preview-label">
            Pokémon selecionado
            <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
              <option value="">Selecione um Pokémon</option>
              {data.pokemon.map((item) => <option key={item.id} value={item.id}>#{String(item.id).padStart(3, '0')} — {item.name}</option>)}
            </select>
          </label>
          <PokemonDetails pokemon={selectedPokemon} />
        </section>
      </main>
      <footer className="pk-preview-footer">POKÉBOX / PRÉVIA DOS MÓDULOS · 151 POKÉMON · DADOS OFICIAIS</footer>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode><ModulesPreview /></StrictMode>)
