# AI SVG Generator

Генератор SVG іконок з AI інтеграцією Groq та збереженням в Neon PostgreSQL.

**Live Demo:** https://svg-generator-ten.vercel.app

## Функціонал

- **AI Генерація** - Описуй іконку словами, Groq AI генерує SVG код
- **Папки (Пресети)** - Організовуй іконки в папки (Кафе, Піцерія, тощо)
- **Редактор SVG** - Правь згенерований код вручну
- **Налаштування** - Змінюй розмір, колір, товщину ліній
- **Завантаження** - Скачуй SVG файли

## Технології

- **Frontend:** Next.js 16.2.1, React 19, TypeScript, Tailwind CSS v4
- **AI:** Groq API (llama-3.3-70b-versatile)
- **Database:** Neon PostgreSQL
- **Deployment:** Vercel

## Локальний запуск

```bash
# Встановлення залежностей
npm install

# Запуск dev сервера
npm run dev
```

Відкрий http://localhost:3000

## Змінні оточення

Створи `.env` файл:

```env
GROQ_API_KEY=your_groq_api_key
NEON_PG_DB_URL=your_neon_connection_string
```

## Структура проєкту

```
app/
├── api/
│   ├── generate-svg/    # AI генерація через Groq
│   ├── icons/           # CRUD для іконок
│   └── presets/         # CRUD для папок
├── page.tsx             # Головний UI
└── layout.tsx
lib/
└── db.ts                # Neon PostgreSQL конфігурація
```

## Як користуватися

1. Створи папку (наприклад "Кафе")
2. Відкрий папку і натисни "Додати іконку"
3. Опиши іконку (наприклад "чашка кави")
4. Натисни "Згенерувати SVG"
5. При потребі відредагуй код вручну
6. Збережи іконку в папку

## Примітки

- AI іноді генерує діч, тому є ручний редактор 😂
- Всі дані зберігаються в Neon PostgreSQL
- Проєкт задеплоєний на Vercel

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
