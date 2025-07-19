# Invoice Pro

A modern, multi-tenant invoice and billing management system built with React, Node.js, and PostgreSQL.

## Features

- 🏢 **Multi-tenant Architecture** - Separate data for each organization
- 👥 **User Management** - Role-based access control
- 📋 **Customer Management** - Comprehensive customer database
- 📦 **Inventory Tracking** - Product and service management
- 📄 **Sales Orders** - Quote and order management
- 🧾 **Invoice Generation** - Professional PDF invoices
- 💳 **Payment Integration** - Cashfree payment gateway
- 📧 **Email Notifications** - Automated email sending
- 📊 **Dashboard Analytics** - Business insights and metrics

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Headless UI** for accessible components

### Backend
- **Node.js** with Express and TypeScript
- **Prisma** ORM with PostgreSQL
- **JWT** authentication
- **Zod** for validation
- **Puppeteer** for PDF generation
- **Nodemailer** for email services

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- SMTP email service

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd invoice-pro
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npx prisma migrate dev
npm run seed
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript definitions
│   └── package.json
├── backend/           # Node.js backend API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middlewares/   # Express middlewares
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── validators/    # Zod schemas
│   ├── prisma/           # Database schema and migrations
│   └── package.json
└── README.md
```

## Environment Configuration

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/invoice_db"
JWT_ACCESS_TOKEN_SECRET="your-access-token-secret"
JWT_REFRESH_TOKEN_SECRET="your-refresh-token-secret"
SMTP_HOST="your-smtp-host"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
CLIENT_URI="http://localhost:3000"
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## API Documentation

The API provides comprehensive endpoints for:

- **Authentication** - User registration, login, password reset
- **Tenant Management** - Multi-tenant organization setup
- **Customer Management** - CRUD operations for customers
- **Inventory Management** - Product and service catalog
- **Sales Orders** - Quote generation and management
- **Invoicing** - Invoice creation and PDF generation
- **Payments** - Payment processing and tracking

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@invoicepro.com or create an issue in the repository.