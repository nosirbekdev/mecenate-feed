# Mecenate — Тестовое задание 1 (Feed)

## Описание
Мобильный экран ленты публикаций для платформы Mecenate (аналог Patreon/Boosty) на `React Native + Expo`.
Пользователь видит посты авторов, на которых подписан: аватар, имя, обложка, превью текста, лайки и комментарии.

## Стек
- `TypeScript`
- `React Native + Expo` (iOS/Android)
- `@tanstack/react-query` (`useInfiniteQuery`) для серверного состояния
- `MobX` для локального UI-состояния
- `react-native-reanimated` для интерактивной анимации лайка
- Дизайн-токены (`src/theme/*`) для цветов, отступов, радиусов, типографики

## Запуск
1. Установить зависимости:
```bash
npm install
```
2. Создать `.env`:
```bash
copy .env.example .env
```
3. Запустить Expo:
```bash
npm run start
```
4. Открыть проект в Expo Go:
- iOS: открыть камеру и отсканировать QR из терминала/Expo DevTools.
- Android: открыть Expo Go и отсканировать QR.

## Переменные окружения
```env
EXPO_PUBLIC_API_URL=https://k8s.mectest.ru/test-app
EXPO_PUBLIC_API_TOKEN=550e8400-e29b-41d4-a716-446655440000
```

API и авторизация:
- Base URL: `https://k8s.mectest.ru/test-app`
- Endpoint: `GET /posts`
- Авторизация: заголовок `Authorization: Bearer <UUID token>`

## Что реализовано
- Экран `Feed` со списком карточек публикаций.
- Карточка поста: аватар автора, имя, превью, обложка, счетчики лайков и комментариев.
- ТЗ-2: анимируемый лайк на карточке поста с локальным optimistic update для счетчика.
- Курсорная пагинация при скролле вниз (`nextCursor`, `hasMore`).
- Pull-to-refresh.
- Заглушка для закрытого контента (`tier: "paid"`): текст поста скрыт, показан placeholder/overlay.
- Ошибка загрузки при недоступном API с точным текстом:
  - `Не удалось загрузить посты`
  - кнопка `Повторить` (повторный запрос).

## Архитектура
```text
src/
  api/         // клиент API и типы
  components/  // переиспользуемые UI-компоненты
  hooks/       // react-query хуки (в т.ч. feed pagination)
  screens/     // экраны приложения
  store/       // MobX store для локального состояния
  theme/       // дизайн-токены
  utils/       // env/config утилиты
```

## Проверка
- Типы:
```bash
npm run typecheck
```
- Локальный запуск:
```bash
npm run start
```
- Платформенный запуск:
```bash
npm run android
npm run ios
```

## Примечания
- Реализация ориентирована на требования тестового задания и работу в Expo Go.
- Cursor pagination, pull-to-refresh, error/retry и placeholder для paid-постов включены в основной пользовательский сценарий.
- Для анимации лайка используется `react-native-reanimated`, совместимый с Expo SDK 54.
