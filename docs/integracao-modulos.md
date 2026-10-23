# Entrega dos módulos — integrante 2

Branch: `feat/detalhes-pokemon`. As etapas 02 a 05 foram autorizadas em conjunto pelo usuário após a análise inicial. Os registros de propostas da etapa 01 permanecem como histórico.

## Arquivos e contratos finais

Todos os componentes usam exportação padrão e recebem registros no formato original do JSON oficial.

| Arquivo | Props | Responsabilidade |
| --- | --- | --- |
| `src/components/details/PokemonDetails.jsx` | `pokemon`: registro ou `null`; `showStats`: booleano opcional, padrão `true` | Identificação, arte por ID, tipos e seis atributos; `showStats={false}` reutiliza a identificação no comparador |
| `src/components/trainers/TrainerList.jsx` | `trainers`: array de treinadores; `pokemon`: array de Pokémon | Seleção local de treinador, quantidade de insígnias e equipe resolvida por ID |
| `src/components/comparison/PokemonComparison.jsx` | `pokemon`: array de Pokémon | Duas seleções locais distintas, comparação dos seis atributos, maior valor, diferença e empate |

Cada componente importa seu CSS na mesma pasta. `src/components/pokemon.js` concentra os seis nomes de atributos, validação dos números, escala de barras e formatação de ID/nome. A única dependência de execução é o React já existente.

```jsx
import PokemonDetails from './components/details/PokemonDetails.jsx'
import TrainerList from './components/trainers/TrainerList.jsx'
import PokemonComparison from './components/comparison/PokemonComparison.jsx'

// Valores fornecidos pela camada de dados e seleção do integrante 1:
<PokemonDetails pokemon={selectedPokemon} />
<TrainerList trainers={trainers} pokemon={pokemonList} />
<PokemonComparison pokemon={pokemonList} />
```

Não é necessário fornecer `types` separadamente: os tipos já estão em `pokemon.types` como objetos `{ id, name }`. Arrays ausentes ou nulos são tratados como vazios. Os IDs do JSON são numéricos. Os valores de `<select>` são strings apenas no estado local; a resolução devolve o objeto original.

## Regras dos dados

- Atributos em `pokemon.stats`: `hp`, `attack`, `defense`, `specialAttack`, `specialDefense` e `speed`.
- Números finitos não negativos são válidos, inclusive zero. Ausência, strings numéricas, negativos e valores não finitos não são tratados como zero.
- Atributo ausente: “Não informado”; a respectiva barra fica vazia e nenhum vencedor é atribuído àquele par.
- Todas as barras usam escala 0–255. Um valor acima do limite mantém seu número, com largura limitada a 100%.
- `pokemon.types` vazio ou ausente: “Tipo não informado”. Não atribuir tipo a Mew por inferência.
- ID ou nome ausentes têm mensagens próprias; imagem sem ID ou com erro de rede tem alternativa textual.
- As imagens vêm de `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`.
- Treinador sem equipe: “Nenhum Pokémon relacionado”. ID sem correspondência: “Pokémon não encontrado”, mantendo a posição da equipe.
- Koga mantém três Venonat; Lance mantém dois Dragonite. Não deduplicar `pokemonIds`.
- Insígnias são exibidas conforme o JSON: zero é válido e nove não é limitado a oito.
- O comparador exige pelo menos dois IDs distintos disponíveis, bloqueia a escolha já usada no outro seletor e informa quando falta selecionar mais um Pokémon.
- Empates são indicados em texto; maior valor recebe cor, borda e “Maior (+diferença)”. A interpretação não depende exclusivamente da cor.
- Trocas na lista recebida por props não deixam uma tabela com Pokémon removido.

## Integração com a interface principal

Os arquivos protegidos `src/App.jsx`, `src/App.css`, `src/index.css` e os dados oficiais em `src/data/` não foram alterados. Não há nova leitura de JSON no aplicativo principal.

A página `preview/index.html` é uma composição independente para revisão dos módulos. `preview/ModulesPreview.jsx` importa a cópia oficial uma única vez e passa os dados por props. Isso permite validar a entrega antes da montagem final pelo integrante 1. O seletor de detalhes nessa página é apenas um controle de revisão e não implementa o catálogo do outro integrante.

A única mudança de configuração é em `vite.config.js`, no objeto `build.rollupOptions.input`, logo após `plugins`: mantém `main: 'index.html'` e inclui `modules: 'preview/index.html'`. Assim, lint e build verificam a entrega sem inserir componentes na interface compartilhada. Não houve alteração de dependências ou do lockfile.

Os componentes usam os tokens `--screen`, `--screen-alt`, `--screen-border`, `--screen-text`, `--muted`, `--accent`, `--accent-soft` e `--track`. Todos os seletores próprios possuem prefixo `pk-`. Nenhum componente altera tema ou armazenamento; a prévia usa a mesma chave `pokebox-theme` da base para demonstrar os dois temas.

Na revisão em dupla:

1. O integrante 1 importa o JSON em sua camada e fornece `selectedPokemon`, `pokemonList` e `trainers`.
2. Definir a montagem dos módulos e a navegação na estrutura atual do dispositivo. Não duplicar o painel fixo de Bulbasaur junto com `PokemonDetails`.
3. Remover ou substituir os valores de prévia, descrição fixa e rótulos estáticos apenas no momento da integração acordada.
4. Conferir altura e rolagem: a base usa altura fixa no desktop; os módulos crescem conforme o conteúdo. A prévia demonstra rolagem natural, sem alterar o comportamento da base.
5. Executar lint, build e revisar os fluxos no aplicativo integrado. Revisão humana e merge continuam pendentes; não foram realizados automaticamente.

## Validação executada

Lint e build passaram nas etapas de detalhes, treinadores e comparação. Na revisão final, `npm ci --no-audit --no-fund`, `npm run lint` e `npm run build` passaram. As duas entradas foram servidas pelo build de produção, com verificação da interface-base, tema compartilhado, treinadores, comparação, largura de 320px e navegação entre os seletores por teclado. Não houve exceção JavaScript nesses fluxos, nem erro de console nos módulos. A página-base possui uma solicitação preexistente de `favicon.ico` sem arquivo correspondente; a prévia aponta explicitamente para o `favicon.svg` existente.

O conteúdo e a ordem da cópia local do JSON foram comparados com a fonte oficial, revisão `035e6fdcd14798a1e321e374f8b6f8e607b113f2`, e são equivalentes.

No navegador, foram exercitados:

| Área | Cenários verificados |
| --- | --- |
| Detalhes | Dados oficiais; Chansey com HP 250; Mew sem tipos; seleção vazia; falha de imagem simulada; troca para outro Pokémon após falha |
| Dados incompletos | Nome e ID ausentes; atributos nulos, ausentes, negativos e strings; zero válido; barra limitada para valor 500 |
| Treinadores | Equipes de Ash, Koga e Lance; repetições; zero insígnias; lista nula; equipe ausente; IDs inexistentes repetidos |
| Comparador | Zero/uma/duas seleções; seis atributos; diferença de HP e Attack; empate de HP entre Bulbasaur e Oddish; opção duplicada bloqueada; dados parciais sem falsos vencedores; lista substituída por props |
| Temas | Claro e escuro; persistência após recarregar; capturas inspecionadas visualmente |
| Responsividade | Larguras de 320, 375, 540, 768, 900, 1024 e 1440 pixels, sem transbordamento horizontal na prévia |

As verificações automatizadas de navegador foram executadas com Playwright CLI, sem adicionar dependência ao projeto. Capturas e roteiros locais de verificação ficam em `output/playwright/`, fora dos arquivos versionados. O erro de rede de imagem foi provocado intencionalmente para verificar a alternativa textual; não é um bloqueio para os dados.

O enunciado requer Pair Programming: esta preparação não substitui a participação dos dois integrantes na revisão e integração. A branch está preparada para essa revisão, sem push ou merge.
