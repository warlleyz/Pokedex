# Etapa 01 — Análise e preparação

## Escopo e estado do Git

- Repositório: https://github.com/warlleyz/Pokedex
- Branch local de trabalho: `feat/detalhes-pokemon`.
- Base conferida após `git fetch origin main`: `90ce198244df59f23bc87e01f23fb2cc0a7840ef`.
- A cópia local foi clonada para esta tarefa e estava limpa antes da preparação.
- Nenhuma implementação de componente nesta etapa. Sem push ou merge.

## Fontes consultadas

- [Enunciado oficial](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003.md).
- [JSON oficial](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003%20-%20JSON/data/pokedex-data.json).
- Revisões dos arquivos consultados: enunciado `f1a530049305bc394328e7ea0c3e931b749ab62e`; JSON `035e6fdcd14798a1e321e374f8b6f8e607b113f2`.

## Arquitetura existente

| Arquivo | Papel atual | Orientação para integração |
| --- | --- | --- |
| `src/main.jsx` | Monta o React em StrictMode e importa o CSS global | Preservar |
| `src/App.jsx` | Interface completa, tema persistido e dados fixos de Bulbasaur | Compartilhado; integração a combinar com o integrante 1 |
| `src/App.css` | Dispositivo de dois painéis, telas, barras, tipos e responsividade | Preservar; evitar seletores globais nos novos módulos |
| `src/index.css` | Variáveis dos temas, estilos básicos e foco | Reutilizar as variáveis existentes |
| `package.json` e `package-lock.json` | React 19, Vite 8 e ferramentas de lint | Nenhuma dependência nova prevista |
| `README.md` | Texto inicial do template Vite | Documentação geral a revisar na etapa final |

Ainda não existem `src/components/` ou `src/data/`, nem importação do JSON. Não há roteador, biblioteca de componentes ou testes configurados. Os cartões de módulos e os espaços de armazenamento são decorativos. O único estado funcional atual é o tema, salvo em `pokebox-theme` e aplicado por `data-theme` na raiz.

O layout possui pontos de adaptação em 900px e 540px, além de regras por altura. No desktop, `.app-shell` limita altura e esconde transbordamento; a futura integração precisa conferir se o conteúdo adicional cabe ou requer rolagem interna. Isso não foi alterado nesta etapa.

## Estrutura real dos dados

O objeto raiz contém `types` (18 registros), `pokemon` (151 registros) e `trainers` (12 registros).

Exemplo de Pokémon, diretamente compatível com a fonte:

```json
{
  "id": 1,
  "name": "Bulbasaur",
  "stats": {
    "hp": 45,
    "attack": 49,
    "defense": 49,
    "specialAttack": 65,
    "specialDefense": 65,
    "speed": 45
  },
  "types": [{ "id": 4, "name": "Grass" }, { "id": 8, "name": "Poison" }]
}
```

Exemplo de treinador:

```json
{ "id": 2, "name": "Brock", "badges": 1, "pokemonIds": [74, 95] }
```

- Tipos são objetos `{ id, name }`, não strings.
- O relacionamento é `trainer.pokemonIds` → `pokemon.id`. Todos os IDs referenciados existem na fonte consultada.
- Koga possui `[48, 48, 48, 49]`; Lance possui `[130, 148, 149, 142, 149]`. Preservar as ocorrências e usar uma chave que inclua a posição na equipe.
- Mew (`151`) possui `types: []`. Mostrar “Tipo não informado”, sem preencher com um tipo inventado.
- Team Rocket possui `badges: 0`; zero é válido e não deve acionar o estado de dado ausente. Ash, Gary e Lance possuem 9 insígnias: não limitar o valor a 8.
- Os seis atributos ficam dentro de `stats`, com `specialAttack` e `specialDefense` em camelCase.
- O maior HP da fonte é 250; barras não podem pressupor máximo 100. Proposta: escala visual comum de 255, como na interface atual, limitando apenas a largura e preservando o valor exibido.
- Não existem campos de imagem, descrição, geração ou região no Pokémon oficial. Não tornar esses campos obrigatórios nem atribuir a descrição fixa de Bulbasaur a outros Pokémon.
- A interface já usa arte oficial do repositório público `PokeAPI/sprites`, derivada do ID. Proposta: manter essa fonte visual e fornecer alternativa textual se a imagem falhar; nenhum atributo dependerá de chamada externa.

## Contratos propostos para revisão conjunta

São propostas para a próxima etapa e para alinhamento com o integrante 1; ainda não representam um acordo com ele. A leitura do JSON e a seleção principal pertencem ao integrante 1. Os três módulos recebem os dados por props, sem uma segunda camada de leitura.

| Componente planejado | Props | Comportamento e responsabilidade |
| --- | --- | --- |
| `src/components/details/PokemonDetails.jsx` | `pokemon`: objeto oficial ou `null` | Mostrar identificação, imagem por ID, tipos e seis atributos; tratar ausência de seleção e campos incompletos |
| `src/components/trainers/TrainerList.jsx` | `trainers`: array oficial; `pokemon`: array oficial | Gerenciar seleção local de treinador e resolver sua equipe por ID, preservando repetições |
| `src/components/comparison/PokemonComparison.jsx` | `pokemon`: array oficial | Gerenciar duas seleções locais por ID, comparar os seis atributos e distinguir maior, empate e dado indisponível |

Cada módulo terá apenas seu JSX e CSS correspondente na mesma pasta, conforme necessário. As importações propostas serão exports padrão. Listas ausentes serão tratadas como vazias. Campos numéricos ausentes não serão convertidos em zero; exibirão “Não informado” e não participarão de comparações. A seleção do comparador deverá solicitar dois Pokémon distintos.

```jsx
<PokemonDetails pokemon={selectedPokemon} />
<TrainerList trainers={trainers} pokemon={pokemonList} />
<PokemonComparison pokemon={pokemonList} />
```

Variáveis disponíveis para os módulos: `--screen`, `--screen-alt`, `--screen-border`, `--screen-text`, `--muted`, `--accent`, `--accent-soft` e `--track`. Os novos seletores deverão ter prefixos próprios para evitar conflitos com `.stat-row`, `.screen` e outras classes atuais. Nenhuma alteração no controle do tema é necessária.

## Pontos de integração a combinar

1. O integrante 1 fornece `pokemonList`, `trainers` e `selectedPokemon` a partir da única importação do JSON.
2. Antes de editar `src/App.jsx`, acordar onde o painel de detalhes será montado: a apresentação atual distribui imagem à esquerda e atributos à direita. A extração para um componente único não deve redesenhar o dispositivo nem duplicar os painéis.
3. A integração deve substituir os valores fixos de nome, ID, imagem, atributos e tipos; a descrição fixa e os rótulos de prévia também precisam ser tratados pelo responsável pela integração.
4. Treinadores e comparador terão suas áreas de navegação definidas na integração, preservando a estrutura visual existente.
5. Nenhum arquivo compartilhado ou dado oficial foi editado nesta etapa. Os arquivos planejados só serão criados em suas respectivas etapas, mediante confirmação do usuário.

## Validação da base

- Ambiente verificado: Node `v24.18.0`, npm `11.16.0`.
- Dependências instaladas com `npm.cmd install --package-lock=false --no-audit --no-fund`, sem modificar os manifestos versionados.
- `npm.cmd run lint`: aprovado.
- `npm.cmd run build`: aprovado.
- Não houve teste visual no navegador nesta etapa; lint e build não comprovam responsividade. A validação visual dos novos módulos será feita nas respectivas etapas, em ambos os temas e em larguras de desktop e celular.

## Próxima etapa

Após a confirmação do usuário, implementar apenas o Módulo A, explicar os arquivos novos e fornecer seu código completo. Validar os dados completos, seleção vazia, tipos ausentes, atributos ausentes e falha de imagem, conferir responsividade, executar lint/build e fazer um commit pequeno em português. A montagem em arquivos compartilhados depende do alinhamento de integração descrito acima. Não iniciar treinadores ou comparador antes de suas próprias confirmações.
