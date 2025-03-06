# BetGanjiV2

Soccer match prediction MVP using AI to predict outcomes of upcoming matches.

## Overview

BetGanjiV2 is a redesigned, simplified version of the original BetGanji application. It focuses on delivering a clean, straightforward user experience for viewing upcoming soccer matches and AI-powered predictions for these matches.

## Features

- Display upcoming soccer matches from major leagues
- AI-powered match outcome predictions using DeepSeek API
- Simple authentication with Gmail/Google account
- Odds integration from The Odds API
- Match data from Football-data API
- Clean, minimalist UI focused on match data and predictions

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js with Google provider
- **Database**: PostgreSQL with Prisma ORM
- **APIs**: 
  - Football-data API for match data
  - The Odds API for betting odds
  - DeepSeek API for AI predictions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- API keys for:
  - Google OAuth (for authentication)
  - Football-data API
  - The Odds API
  - DeepSeek API

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mvonombogho/betganjiV2.git
   cd betganjiV2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in all required environment variables

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
betganjiV2/
├── prisma/                  # Database schema and migrations
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   ├── predictions/     # Predictions page
│   │   ├── login/           # Login page
│   │   └── error.tsx        # Error handling
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── layout/          # Layout components
│   │   ├── matches/         # Match-related components
│   │   ├── predictions/     # Prediction-related components
│   │   └── ui/              # Common UI components
│   ├── lib/                 # Utility functions
│   │   ├── api/             # API clients
│   │   ├── services/        # Business logic
│   │   └── utils.ts         # Helper functions
│   └── types/               # TypeScript type definitions
└── public/                  # Static assets
```

## Deployment

This application can be deployed to Vercel, Netlify, or any other hosting platform that supports Next.js.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
