# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Registra Lá: app Expo / React Native (Expo Router, NativeWind, SQLite + Drizzle) para registro pessoal de ponto e banco de horas. UI e comentários em português. Todos os dados ficam locais no aparelho; a única chamada de rede é a extração de data/hora/NSR de uma foto do comprovante (`extractDataPhoto` em `src/hooks/useRegister.ts`, serviço próprio em `extractor.nexsdev.com.br`).

## Comandos

Gerenciador de pacotes: **bun** (`bun.lock`; CI usa `bun install`). Node 22.13+ (exigência do SDK 58).

```bash
bun install
bun run start                # expo start
bun run dev                  # APP_VARIANT=development expo start (dev client)
bun run android | ios        # expo run:android / run:ios (gera android/ ios/ via prebuild)
bun run lint                 # expo lint — é o que o CI roda
bunx expo-doctor             # segundo check do CI
./node_modules/.bin/tsc --noEmit
```

- Ao validar lint use `./node_modules/.bin/eslint src --no-cache`: o cache do `expo lint` já escondeu erros que depois falharam no CI.
- Testes: só existe `src/utils/__tests__/balance.test.ts` (jest-style, `bun test`). O `tsc` reclama de `describe`/`it`/`expect` nesse arquivo; é erro antigo e conhecido.
- Nunca desative regras do ESLint para passar o CI (decisão do dono do projeto). As regras do React Compiler (`react-hooks/set-state-in-effect`, `static-components`) são atendidas refatorando o código: dados carregados em `useEffect` via `.then(...)` (sem `setState` síncrono), estado derivado ajustado durante a renderização, sem componentes declarados dentro de componentes.

### Banco / migrações

```bash
bunx drizzle-kit generate    # após mudar src/db/schema/*
```

`src/db/migrations/migrations.js` importa os `.sql` diretamente. Isso só funciona com `config.resolver.sourceExts.push('sql')` em `metro.config.js` **e** o plugin Babel `inline-import` (`extensions: ['.sql']`) em `babel.config.js`. Sem o plugin o bundle falha com "Missing semicolon" no `.sql`, e só aparece em build de release (o dev client não faz bundle na EAS). As migrações rodam no boot em `src/app/_layout.tsx` via `useMigrations`.

## Builds

- Variantes por `APP_VARIANT` (`development` | `preview` | vazio = produção) em `app.config.ts`; mudam package/nome e o `runtimeVersion` usa `policy: appVersion`. Perfis em `eas.json` (`appVersionSource: remote`, `autoIncrement` no versionCode).
- EAS: `APP_VARIANT=preview bunx eas-cli build --platform android --profile preview`. Contas/org: `nexcorp`.
- Sem EAS, em container: `cd builder && docker compose run --rm android` (APK release/preview) ou `BUILD_TYPE=debug APP_VARIANT=development docker compose run --rm android`. Gera o projeto nativo com `expo prebuild` numa cópia do código e grava o APK em `builder/out/` (ignorado pelo git). O APK sai assinado com a chave de debug.
- `compileSdkVersion` precisa ser **37** (módulos do SDK 58 exigem); está em `expo-build-properties` no `app.config.ts`. A imagem do container usa a mesma plataforma/NDK do React Native 0.88.
- Alterar a versão do app: `app.config.ts` e `package.json` juntos.

## Arquitetura

- **Rotas** (`src/app`, Expo Router): `index.tsx` redireciona para `/config` se ainda não há configuração, senão `/(tabs)/` (aba Registros = `(tabs)/index.tsx`, aba Calendário = `(tabs)/calendar.tsx`); `add.tsx` cria registro (aceita `?date=`), `[id].tsx` edita, `config.tsx` é um wizard em passos. Navegação em componentes usa `useRouter()` (não o `router` global); `_layout.tsx` ainda usa o global porque trata notificações antes da árvore montar.
- **Dados**: duas tabelas em `src/db/schema` — `config` (única linha relevante: sempre lê a de maior `id`) e `registers` (`type`: trabalho | folga | atestado | saldo). Horários são **minutos desde 00:00**; datas são texto **DD/MM/YYYY**. Acesso ao banco só pelos hooks em `src/hooks` (`useConfig`, `useTimeRecords`, `useRegister`, `useCalendar`, `useUpdate`), que expõem `{ dados, loading, error }` e funções de recarga.
- **Saldo de horas** (`src/utils/balance.ts`, `dateTime.ts`, `convert.ts`): batidas `trabalho` do dia são ordenadas e pareadas (entrada/saída); saldo = trabalhado − jornada (`workHours`) com `tolerance`. `useCalendar` acumula meses anteriores a partir do primeiro registro + `initialBalanceInMinutes`.
- **Notificações** (`src/lib/notifications.ts`): `scheduleWorkdayNotifications(config)` cancela tudo e reagenda 4 pontos (entrada, almoço, retorno, saída) como triggers `WEEKLY` por dia útil, em canais Android separados; chamada ao salvar a configuração. Toque na notificação navega para `data.url` (`/add`).
- **Estilo**: NativeWind **v5 (RC)** + Tailwind v4. Config em `global.css` (`@theme` + `:root`), `postcss.config.mjs` e `withNativewind` no `metro.config.js`; sem `tailwind.config.ts` e sem `nativewind/babel`. `className` só funciona em componentes do React Native: componentes de terceiros (SafeAreaView, Link, LinearGradient) devem vir de `src/components/styled.ts` (wrapper `styled`). Tema: `ThemeProvider` aplica as variáveis de `src/utils/colorThemes.ts` via `VariableContextProvider` e troca o esquema com `Appearance.setColorScheme`; `useTheme()` fornece o tema para cores passadas a ícones.
- Registro de ponto: na tela inicial o botão principal grava o ponto na hora com um toque (tipo `trabalho`, hora atual) e mostra `UndoBar` com "Desfazer" por 6 s; o rótulo segue o próximo ponto esperado (`Registrar entrada`, `Registrar saída para o almoço`...). Foto e "Outro horário" (`/add`) são secundários. Toque na notificação abre a tela inicial.
- Escala visual: cantos `rounded-2xl` (cards, botões principais), `rounded-xl` (inputs, chips, linhas, botões secundários) e `rounded-full` (ícones/pílulas); margem lateral de tela 16 (`px-4`); espaço entre blocos `gap-4`. Horários da jornada usam `TimeField` (seletor nativo, 24h).
- Acessibilidade: ícones/texto de destaque sobre `background`/`surface` usam `colors[theme].accent` (não `primary`, que some no escuro); placeholders usam `colors[theme].placeholder`. Texto sobre `secondary` usa `secondary-content`. Metas: contraste ≥ 4,5:1 e `accessibilityLabel`/`Role` em todo botão só de ícone.
- `lightningcss` é fixado em 1.30.1 (`overrides`/`resolutions`); versões maiores quebram o compilador do `react-native-css`. Se o Metro acusar "failed to deserialize", apague `node_modules/@expo/metro-config/node_modules/lightningcss` ou reinstale.
- No `SafeAreaView` estilizado, `px-*`/`py-*` (padding-inline/block do Tailwind v4) não são aplicados pelo módulo nativo: use `pl-*`/`pr-*`/`pt-*`/`pb-*`.
- Metro com `CI=1` desliga o reload: não use para testar edições.
- **Atualizações OTA**: `expo-updates`; `useUpdate` + `UpdateAlert` na tela inicial. Não existe `expo-status-bar` instalado.
- Ícones: `@react-native-vector-icons/*` (cada pacote precisa estar listado em `plugins` no `app.config.ts`); `@expo/vector-icons` não deve voltar (o `expo-doctor` reprova a mistura).
- Alias `@/*` → `src/*`.
