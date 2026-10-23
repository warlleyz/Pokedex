# PokéBox

Pokédex em React + Vite com visual de dispositivo de dois painéis e temas claro e escuro. Esta branch entrega os módulos do integrante 2, preparados para receber dados do catálogo por props.

## Executar

Ambiente verificado: Node 24.18.0 e npm 11.16.0.

```sh
npm ci
npm run dev
```

No Windows, use `npm.cmd` se o PowerShell bloquear `npm.ps1`.

- Interface-base preservada: http://localhost:5173/
- Prévia funcional dos três módulos: http://localhost:5173/preview/

Use a porta indicada pelo Vite caso a 5173 esteja ocupada.

## Módulos

- `PokemonDetails`: identificação, imagem, tipos, seis atributos, barras e tratamento de dados ausentes.
- `TrainerList`: seleção de treinador, insígnias e equipes por ID, preservando repetições.
- `PokemonComparison`: dois Pokémon distintos, atributos lado a lado, maiores valores, diferenças e empates.

Todos recebem dados por props e usam os temas existentes. Nenhuma dependência nova foi adicionada.

## Organização

```text
src/components/
  pokemon.js
  details/PokemonDetails.jsx + PokemonDetails.css
  trainers/TrainerList.jsx + TrainerList.css
  comparison/PokemonComparison.jsx + PokemonComparison.css
preview/
  index.html
  main.jsx
  ModulesPreview.jsx
  preview.css
  pokedex-data.json
```

`src/App.jsx`, `src/App.css` e `src/index.css` foram preservados. Os componentes não importam JSON nem fazem fetch. A prévia carrega sua cópia oficial uma única vez, sem criar outra leitura no aplicativo principal.

O catálogo, a pesquisa, os filtros, a ordenação, os favoritos e a montagem final continuam com o integrante 1. Veja os [contratos e o guia de integração](docs/integracao-modulos.md). A [análise inicial](docs/etapa-01-analise.md) registra a arquitetura encontrada.

## Dados e imagens

- [Enunciado oficial](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003.md).
- [JSON oficial](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003%20-%20JSON/data/pokedex-data.json): 151 Pokémon, 18 tipos e 12 treinadores; cópia da prévia em `preview/pokedex-data.json`.
- Imagens: [PokeAPI/sprites](https://github.com/PokeAPI/sprites), arte oficial derivada do ID, mantendo a fonte da interface-base. Atributos não dependem de API externa. Se a imagem falhar, os dados continuam disponíveis.

O JSON é mantido sem inventar propriedades: Mew não possui tipos, Team Rocket possui zero insígnias e algumas equipes têm Pokémon repetidos.

## Validar e gerar produção

```sh
npm run lint
npm run build
npm run preview
```

O `vite.config.js` mantém a entrada original e inclui a prévia para que o build valide os novos módulos. Saídas: `dist/index.html` e `dist/preview/index.html`. O servidor de produção normalmente usa http://localhost:4173/preview/.

As validações de dados, interação e responsividade estão registradas no [guia de integração](docs/integracao-modulos.md). A branch foi preparada para revisão em dupla, sem push ou merge automático.
