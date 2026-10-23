
import { useMemo, useState } from 'react'
import {
  isStat,
  pokemonName,
  pokemonNumber,
  selectablePokemon,
} from '../pokemon.js'
import './TrainerList.css'

function TeamMember({ id, index, pokemonById }) {
  const member = pokemonById.get(id)

  return (
    <li className="pk-trainers-member">
      <span className="pk-trainers-member-position">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="pk-trainers-member-art">
        {member ? (
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
            alt=""
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden'
            }}
          />
        ) : (
          <span aria-hidden="true">?</span>
        )}
      </div>

      <span className="pk-trainers-member-number">
        {pokemonNumber(id)}
      </span>

      <strong>
        {member
          ? pokemonName(member)
          : 'Pokémon não encontrado'}
      </strong>
    </li>
  )
}

export default function TrainerList({
  trainers = [],
  pokemon = [],
}) {
  const [selectedId, setSelectedId] = useState(null)

  const available = useMemo(
    () => Array.isArray(trainers)
      ? trainers.filter(
        (trainer) => trainer && Number.isInteger(trainer.id)
      )
      : [],
    [trainers]
  )

  const pokemonById = useMemo(
    () => new Map(
      selectablePokemon(pokemon).map((item) => [
        item.id,
        item,
      ])
    ),
    [pokemon]
  )

  const selectedIndex = available.findIndex(
    (trainer) => trainer.id === selectedId
  )

  const currentIndex = selectedIndex === -1
    ? 0
    : selectedIndex

  const selected = available[currentIndex] ?? null

  const team = Array.isArray(selected?.pokemonIds)
    ? selected.pokemonIds
    : []

  function changeTrainer(direction) {
    if (!available.length) return

    const nextIndex = (
      currentIndex + direction + available.length
    ) % available.length

    setSelectedId(available[nextIndex].id)
  }

  if (!selected) {
    return (
      <section
        className="pk-trainers pk-trainers-empty"
        aria-label="Consulta de treinadores"
      >
        <h3>Nenhum treinador disponível</h3>
        <p>Não há registros de treinadores no banco de dados.</p>
      </section>
    )
  }

  return (
    <section
      className="pk-trainers"
      aria-label="Consulta de treinadores"
    >
      <header className="pk-trainers-header">
        <div>
          <span className="pk-trainers-eyebrow">
            POKÉDEX / TRAINER DATABASE
          </span>
          <h3>Explorar treinadores</h3>
        </div>

        <span className="pk-trainers-total">
          {available.length} registros
        </span>
      </header>

      <div className="pk-trainers-layout">
        <aside className="pk-trainers-sidebar">
          <div className="pk-trainers-section-title">
            <span>SELEÇÃO DE TREINADOR</span>
            <span>
              {String(currentIndex + 1).padStart(2, '0')}
              {' / '}
              {String(available.length).padStart(2, '0')}
            </span>
          </div>

          <div className="pk-trainers-selector">
            <button
              type="button"
              onClick={() => changeTrainer(-1)}
              aria-label="Treinador anterior"
              title="Treinador anterior"
            >
              ←
            </button>

            <select
              aria-label="Selecionar treinador"
              value={selected.id}
              onChange={(event) =>
                setSelectedId(Number(event.target.value))
              }
            >
              {available.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name || 'Nome não informado'}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => changeTrainer(1)}
              aria-label="Próximo treinador"
              title="Próximo treinador"
            >
              →
            </button>
          </div>

          <div
            className="pk-trainers-profile"
            key={selected.id}
          >
            <div className="pk-trainers-avatar" aria-hidden="true">
              {selected.name?.trim().charAt(0).toUpperCase() || '?'}
            </div>

            <span className="pk-trainers-eyebrow">
              PERFIL DO TREINADOR
            </span>

            <h4>{selected.name || 'Nome não informado'}</h4>

            <div className="pk-trainers-profile-stats">
              <div>
                <span>INSÍGNIAS</span>
                <strong>
                  {isStat(selected.badges)
                    ? selected.badges
                    : '—'}
                </strong>
              </div>

              <div>
                <span>EQUIPE</span>
                <strong>{team.length}</strong>
              </div>
            </div>
          </div>

          <div className="pk-trainers-sidebar-footer">
            <span className="pk-trainers-status-dot" />
            REGISTRO ATIVO
          </div>
        </aside>

        <div className="pk-trainers-team-panel">
          <div className="pk-trainers-section-title">
            <span>EQUIPE POKÉMON</span>
            <span>{team.length} integrantes</span>
          </div>

          {team.length ? (
            <ol className="pk-trainers-team">
              {team.map((id, index) => (
                <TeamMember
                  key={`${id}-${index}`}
                  id={id}
                  index={index}
                  pokemonById={pokemonById}
                />
              ))}
            </ol>
          ) : (
            <div className="pk-trainers-no-team" role="status">
              <span aria-hidden="true">◇</span>
              <p>Este treinador não possui Pokémon registrados.</p>
            </div>
          )}

          <div className="pk-trainers-team-footer">
            <span>EQUIPE VINCULADA AO REGISTRO</span>
            <span>POKÉDEX SYSTEM</span>
          </div>
        </div>
      </div>
    </section>
  )
}
