import { useState } from 'react'
import { isStat, pokemonName, pokemonNumber, STAT_FIELDS, statWidth } from '../pokemon.js'
import './PokemonDetails.css'

function PokemonArtwork({ id, name }) {
  const [failed, setFailed] = useState(false)
  const hasId = Number.isInteger(id) && id > 0

  return (
    <div className="pk-details-artwork">
      {hasId && !failed ? (
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
          alt={name}
          width="260"
          height="260"
          onError={() => setFailed(true)}
        />
      ) : (
        <p className="pk-details-image-fallback">Imagem indisponível</p>
      )}
    </div>
  )
}

/** Recebe um registro do JSON oficial. showStats permite reutilizar a identidade no comparador. */
export default function PokemonDetails({ pokemon, showStats = true }) {
  if (!pokemon || typeof pokemon !== 'object' || Array.isArray(pokemon)) {
    return (
      <section className="pk-details pk-details-empty" aria-label="Detalhes do Pokémon">
        <h3>Nenhum Pokémon selecionado</h3>
        <p>Selecione um Pokémon para consultar seus detalhes.</p>
      </section>
    )
  }

  const name = pokemonName(pokemon)
  const types = Array.isArray(pokemon.types)
    ? pokemon.types.filter((type) => typeof type?.name === 'string' && type.name.trim())
    : []

  return (
    <section className="pk-details" aria-label={`Detalhes de ${name}`}>
      <header className="pk-details-heading">
        <div>
          <span className="pk-details-eyebrow">POKÉMON DATABASE</span>
          <h3>{name}</h3>
        </div>
        <span className="pk-details-number">{pokemonNumber(pokemon.id)}</span>
      </header>

      <PokemonArtwork key={pokemon.id ?? 'missing'} id={pokemon.id} name={name} />

      <ul className="pk-details-types" aria-label="Tipos">
        {types.length ? types.map((type, index) => (
          <li
            className="pk-details-type"
            data-type={type.name.toLowerCase()}
            key={`${type.id ?? type.name}-${index}`}
          >
            {type.name}
          </li>
        )) : <li className="pk-details-type">Tipo não informado</li>}
      </ul>

      {showStats && (
        <div className="pk-details-stats">
          <p className="pk-details-eyebrow">ATRIBUTOS BASE</p>
          <dl>
            {STAT_FIELDS.map(({ key, label }) => {
              const value = pokemon.stats?.[key]
              const available = isStat(value)
              return (
                <div className="pk-details-stat" key={key}>
                  <dt>{label}</dt>
                  <dd>
                    <span className="pk-details-track" aria-hidden="true">
                      <span style={{ width: statWidth(value) }} />
                    </span>
                    <span className="pk-details-value">{available ? value : 'Não informado'}</span>
                  </dd>
                </div>
              )
            })}
          </dl>
          <p className="pk-details-scale">Escala visual: 0–255</p>
        </div>
      )}
    </section>
  )
}
