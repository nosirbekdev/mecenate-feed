# Mecenate Feed

Мобильное Expo-приложение ленты публикаций для платформы Mecenate.

## Возможности
- Лента публикаций с фильтрами `Все`, `Бесплатные`, `Платные`.
- Переход из ленты на экран деталей публикации.
- Ленивый запрос комментариев на экране деталей.
- Отправка комментария с обновлением списка и haptic feedback.
- Live-обновления комментариев через WebSocket.
- Optimistic update лайка через React Query cache.
- Пагинация ленты и комментариев, pull-to-refresh для ленты.
- Empty/error/loading состояния без скрытия табов ленты.
- Overlay для платных публикаций.

## Setup
```bash
npm install
copy .env.example .env
```

Заполните `.env` значениями, выданными для окружения:
```env
EXPO_PUBLIC_API_URL=https://example.com/api
EXPO_PUBLIC_API_TOKEN=replace-with-issued-token
```

В репозитории не хранятся реальные токены. Если переменные окружения не заданы, приложение выбросит явную ошибку при инициализации API-клиента.

## Run
```bash
npm run start
npm run android
npm run ios
```

Проверка TypeScript:
```bash
npm run typecheck
```

## Architecture
```text
src/
  api/          axios client, API methods, DTO types
  components/   reusable UI components
  hooks/        React Query hooks for feed/comments
  navigation/   stack navigation types
  screens/      Feed and PostDetail screens
  store/        MobX UI state
  theme/        design tokens
  utils/        env and formatting helpers
```

## API
- `GET /posts`
- `POST /posts/:postId/like`
- `GET /posts/:postId/comments`
- `POST /posts/:postId/comments`
- `WS /posts/:postId/comments/ws`

`EXPO_PUBLIC_API_TOKEN` отправляется только из env в заголовке `Authorization: Bearer <token>`.

## Known limitations
- WebSocket path is derived from `EXPO_PUBLIC_API_URL`; backend must expose `posts/:postId/comments/ws`.
- Comment creation and like mutation expect backend support for the endpoints listed above.
- The app is configured for Expo SDK 54 and TypeScript strict mode.
