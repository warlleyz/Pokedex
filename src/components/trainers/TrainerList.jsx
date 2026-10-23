import { useState } from 'react'
import { isStat, pokemonName, pokemonNumber, selectablePokemon } from '../pokemon.js'
import './TrainerList.css'

/** Equipes são resolvidas por pokemonIds; ocorrências repetidas são preservadas. */
export default function TrainerList({ trainers, pokemon }) {
  const [selectedId, setSelectedId] = useState(null)
  const available = Array.isArray(trainers)
    ? trainers.filter((trainer) => trainer && Number.isInteger(trainer.id))
    : []
  const selected = available.find((trainer) => trainer.id === selectedId)
  const byId = new Map(selectablePokemon(pokemon).map((item) => [item.id, item]))
  const team = Array.isArray(selected?.pokemonIds) ? selected.pokemonIds : []

  return (
    <section className="pk-trainers" aria-label="Consulta de treinadores">
      {!available.length ? (
        <p className="pk-trainers-message" role="status">Nenhum treinador disponível.</p>
      ) : (
        <>
          <ul className="pk-trainers-list" aria-label="Treinadores disponíveis">
            {available.map((trainer) => (
              <li key={trainer.id}>
                <button
                  className="pk-trainers-choice"
                  type="button"
                  aria-pressed={trainer.id === selected?.id}
                  onClick={() => setSelectedId(trainer.id)}
                >
                  <strong>{trainer.name || 'Nome não informado'}</strong>
                  <span>{isStat(trainer.badges) ? `${trainer.badges} insígnias` : 'Insígnias não informadas'}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="pk-trainers-profile" aria-live="polite" aria-atomic="true">
            {selected ? (
              <>
                <span className="pk-trainers-eyebrow">TRAINER PROFILE</span>
                <h3>{selected.name || 'Nome não informado'}</h3>
                <p className="pk-trainers-badges">
                  {isStat(selected.badges) ? `${selected.badges} insígnias` : 'Insígnias não informadas'}
                </p>
                <h4>Equipe Pokémon</h4>
                {team.length ? (
                  <ol className="pk-trainers-team">
                    {team.map((id, index) => {
                      const member = byId.get(id)
                      return (
                        <li key={`${id}-${index}`}>
                          <span className="pk-trainers-position">{String(index + 1).padStart(2, '0')}</span>
                          <div>
                            <span className="pk-trainers-number">{pokemonNumber(id)}</span>
                            <strong>{member ? pokemonName(member) : 'Pokémon não encontrado'}</strong>
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                ) : <p className="pk-trainers-message">Nenhum Pokémon relacionado.</p>}
              </>
            ) : <p className="pk-trainers-message">Selecione um treinador para visualizar suas insígnias e sua equipe.</p>}
          </div>
        </>
      )}
    </section>
  )
}
