
import { useState } from 'react'
import {
  isStat,
  pokemonName,
  pokemonNumber,
  STAT_FIELDS,
  statWidth,
} from '../pokemon.js'
import './PokemonDetails.css'

const statLabels = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  specialAttack: 'Ataque especial',
  specialDefense: 'Defesa especial',
  speed: 'Velocidade',
}

function PokemonArtwork({ id, name }) {
  const [failed, setFailed] = useState(false)
  const hasId = Number.isInteger(id) && id > 0

  return (
    <div className="pk-details-artwork">
      <div className="pk-details-scan" aria-hidden="true">
        <span />
        <span />
      </div>

      {hasId && !failed ? (
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
          alt={name}
          width="280"
          height="280"
          onError={() => setFailed(true)}
        />
      ) : (
        <p className="pk-details-image-fallback">
          Imagem indisponível
        </p>
      )}

      <span className="pk-details-artwork-label">
        VISUALIZAÇÃO / {pokemonNumber(id)}
      </span>
    </div>
  )
}

function PokemonTypes({ types }) {
  return (
    <div className="pk-details-type-section">
      <span className="pk-details-eyebrow">
        CLASSIFICAÇÃO
      </span>

      <ul className="pk-details-types" aria-label="Tipos do Pokémon">
        {types.length ? (
          types.map((type, index) => (
            <li
              className="pk-details-type"
              data-type={type.name.toLowerCase()}
              key={`${type.id ?? type.name}-${index}`}
            >
              {type.name}
            </li>
          ))
        ) : (
          <li className="pk-details-type">
            Tipo não informado
          </li>
        )}
      </ul>
    </div>
  )
}

function PokemonStats({ stats }) {
  const total = STAT_FIELDS.reduce((sum, { key }) => {
    const value = stats?.[key]
    return sum + (isStat(value) ? value : 0)
  }, 0)

  const complete = STAT_FIELDS.every(({ key }) =>
    isStat(stats?.[key])
  )

  return (
    <div className="pk-details-stats">
      <div className="pk-details-stats-heading">
        <div>
          <span className="pk-details-eyebrow">
            ANÁLISE DE COMBATE
          </span>
          <h4>Atributos base</h4>
        </div>

        <div className="pk-details-stat-total">
          <span>TOTAL</span>
          <strong>{complete ? total : '—'}</strong>
        </div>
      </div>

      <dl className="pk-details-stat-list">
        {STAT_FIELDS.map(({ key, label }) => {
          const value = stats?.[key]
          const available = isStat(value)

          return (
            <div className="pk-details-stat" key={key}>
              <dt title={label}>
                {statLabels[key] ?? label}
              </dt>

              <dd>
                <span
                  className="pk-details-track"
                  aria-hidden="true"
                >
                  <span style={{ width: statWidth(value) }} />
                </span>

                <strong className="pk-details-value">
                  {available ? value : '—'}
                </strong>
              </dd>
            </div>
          )
        })}
      </dl>

      <p className="pk-details-scale">
        Escala das barras: 0–255
      </p>
    </div>
  )
}

/**
 * Exibe um registro do JSON oficial.
 * showStats=false mantém o modo compacto reutilizável.
 */
export default function PokemonDetails({
  pokemon,
  showStats = true,
}) {
  if (
    !pokemon ||
    typeof pokemon !== 'object' ||
    Array.isArray(pokemon)
  ) {
    return (
      <section
        className="pk-details pk-details-empty"
        aria-label="Detalhes do Pokémon"
      >
        <h3>Nenhum Pokémon selecionado</h3>
        <p>Selecione um Pokémon para consultar seus detalhes.</p>
      </section>
    )
  }

  const name = pokemonName(pokemon)
  const types = Array.isArray(pokemon.types)
    ? pokemon.types.filter(
      (type) =>
        typeof type?.name === 'string' &&
        type.name.trim()
    )
    : []

  return (
    <section
      className={`pk-details ${showStats ? '' : 'pk-details-compact'
        }`}
      aria-label={`Detalhes de ${name}`}
    >
      <div className="pk-details-identity">
        <header className="pk-details-heading">
          <div>
            <span className="pk-details-eyebrow">
              REGISTRO POKÉMON
            </span>
            <h3>{name}</h3>
          </div>

          <span className="pk-details-number">
            {pokemonNumber(pokemon.id)}
          </span>
        </header>

        <PokemonArtwork
          key={pokemon.id ?? 'missing'}
          id={pokemon.id}
          name={name}
        />
      </div>

      <div className="pk-details-data">
        <PokemonTypes types={types} />

        {showStats && (
          <PokemonStats stats={pokemon.stats} />
        )}
      </div>
    </section>
  )
}
