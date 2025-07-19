# Invoice Pro Backend

This is the backend API for Invoice Pro, built with Node.js, Express, TypeScript, and Prisma.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Zod** - Schema validation
- **Nodemailer** - Email service
- **Puppeteer** - PDF generation

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your database and other environment variables in `.env`

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database (optional):
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed the database

## API Documentation

The API follows RESTful conventions. Main endpoints:

- `/api/v1/auth` - Authentication
- `/api/v1/customers` - Customer management
- `/api/v1/inventory-item` - Inventory management
- `/api/v1/sales-order` - Sales orders
- `/api/v1/invoice` - Invoices
- `/api/v1/plans` - Subscription plans

## Database

The application uses PostgreSQL with Prisma ORM. The database schema includes:

- Multi-tenant architecture
- User authentication and authorization
- Customer management
- Inventory tracking
- Sales orders and invoices
- Subscription plans

## Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
DATABASE_URL="postgresql://..."
JWT_ACCESS_TOKEN_SECRET="your-secret"
JWT_REFRESH_TOKEN_SECRET="your-secret"
SMTP_HOST="your-smtp-host"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Run database migrations:
```bash
npx prisma migrate deploy
```

3. Start the production server:
```bash
npm start
```