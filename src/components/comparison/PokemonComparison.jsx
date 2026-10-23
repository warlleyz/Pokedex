import { useState } from 'react'
import PokemonDetails from '../details/PokemonDetails.jsx'
import { isStat, pokemonName, pokemonNumber, selectablePokemon, STAT_FIELDS, statWidth } from '../pokemon.js'
import './PokemonComparison.css'

function StatValue({ value, other }) {
  const comparable = isStat(value) && isStat(other)
  const winner = comparable && value > other
  const tied = comparable && value === other

  return (
    <td className={winner ? 'pk-comparison-winner' : undefined}>
      <strong>{isStat(value) ? value : 'Não informado'}</strong>
      <span className="pk-comparison-track" aria-hidden="true">
        <span style={{ width: statWidth(value) }} />
      </span>
      <span className="pk-comparison-result">
        {winner ? `Maior (+${value - other})` : tied ? 'Empate' : comparable ? 'Menor' : 'Sem comparação'}
      </span>
    </td>
  )
}

/** Seleções locais; dados oficiais recebidos integralmente por props. */
export default function PokemonComparison({ pokemon }) {
  const [firstId, setFirstId] = useState('')
  const [secondId, setSecondId] = useState('')
  const available = selectablePokemon(pokemon)
  const first = available.find((item) => String(item.id) === firstId)
  const second = available.find((item) => String(item.id) === secondId && item.id !== first?.id)
  const enoughOptions = new Set(available.map((item) => item.id)).size >= 2

  return (
    <section className="pk-comparison" aria-label="Comparador de Pokémon">
      <div className="pk-comparison-selectors">
        <label>
          Primeiro Pokémon
          <select value={first ? firstId : ''} onChange={(event) => setFirstId(event.target.value)} disabled={!enoughOptions}>
            <option value="">Selecione o primeiro</option>
            {available.map((item) => (
              <option key={item.id} value={item.id} disabled={String(item.id) === secondId}>
                {pokemonNumber(item.id)} — {pokemonName(item)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Segundo Pokémon
          <select value={second ? secondId : ''} onChange={(event) => setSecondId(event.target.value)} disabled={!enoughOptions}>
            <option value="">Selecione o segundo</option>
            {available.map((item) => (
              <option key={item.id} value={item.id} disabled={String(item.id) === firstId}>
                {pokemonNumber(item.id)} — {pokemonName(item)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="pk-comparison-message" role="status">
        {!enoughOptions ? 'São necessários pelo menos dois Pokémon disponíveis.'
          : !first && !second ? 'Selecione dois Pokémon diferentes para comparar seus atributos.'
            : !first || !second ? 'Selecione mais um Pokémon para iniciar a comparação.'
              : `Comparando ${pokemonName(first)} e ${pokemonName(second)}. O maior valor de cada atributo está destacado.`}
      </p>

      <div className="pk-comparison-identities">
        <PokemonDetails pokemon={first} showStats={false} />
        <PokemonDetails pokemon={second} showStats={false} />
      </div>

      {first && second && (
        <table className="pk-comparison-table">
          <caption>Comparação dos atributos base · escala visual 0–255</caption>
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
                <th scope="row">{label}</th>
                <StatValue value={first.stats?.[key]} other={second.stats?.[key]} />
                <StatValue value={second.stats?.[key]} other={first.stats?.[key]} />
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
