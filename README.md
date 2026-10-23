# Pokédex

Aplicação web desenvolvida com **React + Vite** para consulta de informações sobre Pokémon e treinadores.

O projeto apresenta uma interface inspirada na Pokédex, com visual de dispositivo eletrônico, navegação entre módulos e temas claro e escuro.

## Funcionalidades

- Catálogo com imagens, números, nomes e tipos dos Pokémon.
- Pesquisa por nome ou número.
- Filtro por tipo.
- Ordenação por número, nome e atributos.
- Sistema de favoritos com persistência local.
- Paginação do catálogo.
- Visualização detalhada dos seis atributos base.
- Consulta de treinadores, insígnias e equipes.
- Comparação de dois Pokémon, com destaque dos maiores atributos e empates.
- Navegação entre módulos.
- Temas claro e escuro.
- Interface adaptativa para diferentes tamanhos de tela.

## Tecnologias

- React
- JavaScript
- Vite
- CSS
- HTML
- Git e GitHub

## Como executar

**Pré-requisitos:** Node.js e npm compatíveis com as dependências do projeto.

Clone o repositório:

```bash
git clone https://github.com/warlleyz/Pokedex.git
cd Pokedex
```

Instale as dependências:

```bash
npm ci
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra o endereço informado pelo Vite no navegador.

## Validação

Verifique o código:

```bash
npm run lint
```

Gere a versão de produção:

```bash
npm run build
```

Visualize a versão gerada:

```bash
npm run preview
```

## Organização

```text
src/
  components/
    catalog/
    comparison/
    details/
    trainers/
    pokemon.js
  data/
    pokedex-data.json
  App.jsx
  App.css
  index.css
```

Os componentes são independentes e recebem os registros por propriedades. A aplicação principal gerencia a navegação, o tema e a seleção dos Pokémon.

## Fonte dos dados

Os dados utilizados são provenientes do JSON fornecido na atividade acadêmica:

[JSON oficial da atividade](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003%20-%20JSON/data/pokedex-data.json)

As imagens são obtidas do repositório público de sprites da PokéAPI.

## Contexto acadêmico

Projeto desenvolvido em dupla para a disciplina de Desenvolvimento e Integração de Aplicações Web.

**Atividade:** [Atividade 03 — Pokédex](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003.md).

## Repositório

[github.com/warlleyz/Pokedex](https://github.com/warlleyz/Pokedex)