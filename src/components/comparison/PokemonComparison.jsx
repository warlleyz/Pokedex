
import { useMemo, useState } from 'react'
import {
  isStat,
  pokemonName,
  pokemonNumber,
  selectablePokemon,
  STAT_FIELDS,
  statWidth,
} from '../pokemon.js'
import './PokemonComparison.css'

const labels = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  specialAttack: 'Ataque especial',
  specialDefense: 'Defesa especial',
  speed: 'Velocidade',
}

function totalStats(pokemon) {
  if (!pokemon) return null

  const values = STAT_FIELDS.map(({ key }) => pokemon.stats?.[key])

  if (!values.every(isStat)) return null

  return values.reduce((sum, value) => sum + value, 0)
}

function PokemonPanel({ pokemon, side }) {
  const [imageFailed, setImageFailed] = useState(false)

  const types = Array.isArray(pokemon?.types)
    ? pokemon.types.filter(
      (type) => typeof type?.name === 'string' && type.name.trim()
    )
    : []

  return (
    <article className="pk-comparison-pokemon">
      <div className="pk-comparison-pokemon-top">
        <span>POKÉMON {side}</span>
        <span>{pokemon ? pokemonNumber(pokemon.id) : '---'}</span>
      </div>

      <div className="pk-comparison-pokemon-main">
        <div className="pk-comparison-artwork">
          {pokemon && !imageFailed ? (
            <img
              key={pokemon.id}
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
              alt={pokemonName(pokemon)}
              width="150"
              height="150"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className="pk-comparison-placeholder" aria-hidden="true">
              {pokemon ? '◇' : '?'}
            </span>
          )}
        </div>

        <div className="pk-comparison-pokemon-info">
          <h4>{pokemon ? pokemonName(pokemon) : 'Não selecionado'}</h4>

          <div className="pk-comparison-types">
            {types.map((type, index) => (
              <span key={`${type.name}-${index}`}>
                {type.name}
              </span>
            ))}
          </div>

          <div className="pk-comparison-total">
            <span>Total de atributos</span>
            <strong>{totalStats(pokemon) ?? '—'}</strong>
          </div>
        </div>
      </div>
    </article>
  )
}

function StatCell({ value, other }) {
  const comparable = isStat(value) && isStat(other)
  const winner = comparable && value > other
  const tied = comparable && value === other

  return (
    <td
      className={[
        'pk-comparison-stat-cell',
        winner ? 'pk-comparison-winner' : '',
        tied ? 'pk-comparison-tie' : '',
      ].filter(Boolean).join(' ')}
    >
      <div className="pk-comparison-stat-value">
        <strong>{isStat(value) ? value : '—'}</strong>
        {winner && <span aria-label="Maior atributo">▲</span>}
        {tied && <span aria-label="Empate">=</span>}
      </div>

      <span className="pk-comparison-track" aria-hidden="true">
        <span style={{ width: statWidth(value) }} />
      </span>
    </td>
  )
}

export default function PokemonComparison({ pokemon = [] }) {
  const [firstId, setFirstId] = useState('')
  const [secondId, setSecondId] = useState('')

  const available = useMemo(
    () => selectablePokemon(pokemon),
    [pokemon]
  )

  const first = available.find(
    (item) => String(item.id) === firstId
  )

  const second = available.find(
    (item) =>
      String(item.id) === secondId &&
      item.id !== first?.id
  )

  const enoughOptions =
    new Set(available.map((item) => item.id)).size >= 2

  const comparisonReady = Boolean(first && second)

  const result = useMemo(() => {
    if (!first || !second) return null

    let firstWins = 0
    let secondWins = 0
    let ties = 0

    STAT_FIELDS.forEach(({ key }) => {
      const a = first.stats?.[key]
      const b = second.stats?.[key]

      if (!isStat(a) || !isStat(b)) return

      if (a > b) firstWins += 1
      else if (b > a) secondWins += 1
      else ties += 1
    })

    return { firstWins, secondWins, ties }
  }, [first, second])

  function swapPokemon() {
    setFirstId(secondId)
    setSecondId(firstId)
  }

  return (
    <section
      className="pk-comparison"
      aria-label="Comparador de Pokémon"
    >
      <header className="pk-comparison-header">
        <div>
          <span className="pk-comparison-eyebrow">
            POKÉDEX / BATTLE ANALYSIS
          </span>
          <h3>Comparar Pokémon</h3>
        </div>

        <span className="pk-comparison-header-tag">
          02 POKÉMON
        </span>
      </header>

      <div className="pk-comparison-selectors">
        <label>
          <span>Primeiro Pokémon</span>
          <select
            value={first ? firstId : ''}
            disabled={!enoughOptions}
            onChange={(event) => setFirstId(event.target.value)}
          >
            <option value="">Selecione um Pokémon</option>

            {available.map((item) => (
              <option
                key={item.id}
                value={item.id}
                disabled={String(item.id) === secondId}
              >
                {pokemonNumber(item.id)} — {pokemonName(item)}
              </option>
            ))}
          </select>
        </label>

        <button
          className="pk-comparison-swap"
          type="button"
          onClick={swapPokemon}
          disabled={!comparisonReady}
          aria-label="Trocar posições dos Pokémon"
          title="Trocar posições"
        >
          ⇄
        </button>

        <label>
          <span>Segundo Pokémon</span>
          <select
            value={second ? secondId : ''}
            disabled={!enoughOptions}
            onChange={(event) => setSecondId(event.target.value)}
          >
            <option value="">Selecione um Pokémon</option>

            {available.map((item) => (
              <option
                key={item.id}
                value={item.id}
                disabled={String(item.id) === firstId}
              >
                {pokemonNumber(item.id)} — {pokemonName(item)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="pk-comparison-identities">
        <PokemonPanel
          key={`first-${first?.id ?? 'empty'}`}
          pokemon={first}
          side="01"
        />

        <PokemonPanel
          key={`second-${second?.id ?? 'empty'}`}
          pokemon={second}
          side="02"
        />
      </div>

      {comparisonReady ? (
        <>
          <div className="pk-comparison-table-header">
            <div>
              <span className="pk-comparison-eyebrow">
                COMPARAÇÃO DE ATRIBUTOS
              </span>
              <h4>Estatísticas base</h4>
            </div>

            <span>Escala 0–255</span>
          </div>

          <table className="pk-comparison-table">
            <thead>
              <tr>
                <th scope="col">Atributo</th>
                <th scope="col">{pokemonName(first)}</th>
                <th scope="col">{pokemonName(second)}</th>
              </tr>
            </thead>

            <tbody>
              {STAT_FIELDS.map(({ key, label }) => (
                <tr key={key}>
                  <th scope="row">{labels[key] ?? label}</th>
                  <StatCell
                    value={first.stats?.[key]}
                    other={second.stats?.[key]}
                  />
                  <StatCell
                    value={second.stats?.[key]}
                    other={first.stats?.[key]}
                  />
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pk-comparison-summary">
            <span>
              <strong>{result.firstWins}</strong> vantagens de {pokemonName(first)}
            </span>
            <span>
              <strong>{result.ties}</strong> empates
            </span>
            <span>
              <strong>{result.secondWins}</strong> vantagens de {pokemonName(second)}
            </span>
          </div>
        </>
      ) : (
        <div className="pk-comparison-empty" role="status">
          <span aria-hidden="true">⇄</span>
          <h4>Pronto para comparar</h4>
          <p>
            {enoughOptions
              ? 'Selecione dois Pokémon diferentes para visualizar seus atributos lado a lado.'
              : 'São necessários pelo menos dois Pokémon disponíveis.'}
          </p>
        </div>
      )}
    </section>
  )
}
