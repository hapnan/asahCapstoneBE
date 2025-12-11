# Asah Capstone Backend

Backend API for Asah Capstone Project built with Hapi.js, Prisma ORM v7,
PostgreSQL, Redis, and WebAuthn authentication.

## 🚀 Tech Stack

- **Framework**: [Hapi.js](https://hapi.dev/) v21
- **ORM**: [Prisma](https://www.prisma.io/) v7 with Accelerate + Caching
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: [SimpleWebAuthn](https://simplewebauthn.dev/) (Passkey
  authentication)
- **Session**: @hapi/yar (Cookie-based sessions)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20.19 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [Redis](https://redis.io/) (v6 or higher)
- [Prisma Accelerate](https://console.prisma.io/) account (for caching)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/hapnan/asahCapstoneBE.git
cd asahCapstoneBE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Direct PostgreSQL Connection (for migrations)
DIRECT_DATABASE_URL="postgresql://user:password@localhost:5432/asah_db"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development
```

### 4. Set Up Database

Generate Prisma Client:

```bash
npm run generate
```

Run database migrations:

```bash
npm run migrate
```

### 5. Start Redis

Make sure Redis is running:

```bash
# On Windows (if installed via Chocolatey or WSL)
redis-server

# On macOS (if installed via Homebrew)
brew services start redis

# On Linux
sudo systemctl start redis
```

### 6. Start Development Server

```bash
npm run start:dev
```

The server will start at `http://localhost:3000`

## 📜 Available Scripts

| Command                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `npm start`              | Start development server (alias for `start:dev`)   |
| `npm run start:dev`      | Start development server with hot reload (nodemon) |
| `npm run start:prod`     | Start production server                            |
| `npm run generate`       | Generate Prisma Client                             |
| `npm run migrate`        | Run database migrations (dev)                      |
| `npm run migrate:deploy` | Deploy migrations (production)                     |

## 🔌 API Endpoints

### Authentication (WebAuthn/Passkey)

| Method | Endpoint                 | Description                                |
| ------ | ------------------------ | ------------------------------------------ |
| `GET`  | `/auth/register/options` | Get registration options for new passkey   |
| `POST` | `/auth/register/verify`  | Verify and complete passkey registration   |
| `POST` | `/auth/login/options`    | Get authentication options                 |
| `POST` | `/auth/login/verify`     | Verify and complete passkey authentication |
| `POST` | `/auth/logout`           | Logout user                                |
| `GET`  | `/auth/session/check`    | Check current session status               |

### Customers

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| `GET`  | `/customers`     | Get all customers list               |
| `GET`  | `/customers/:id` | Get one customer based on customerId |

## 🗄️ Database Schema

The project uses Prisma ORM with the following models:

### User

- `id`: UUID (Primary Key)
- `username`: String (Unique)
- `name`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime
- Relations: Has many `passkeys`

### Passkeys

- `id`: String (Primary Key)
- `publicKey`: Bytes
- `userId`: String (Foreign Key)
- `webauthnUserID`: String (Unique)
- `counter`: BigInt
- `deviceType`: Enum (singleDevice, multiDevice)
- `backedUp`: Boolean
- `transports`: Array of AuthenticatorTransportFuture
- `createdAt`: DateTime
- `lastUsedAt`: DateTime
- Relations: Belongs to `User`

### Customers

- `id`: Int (Primary Key)
- `name`: String
- `age`: Int
- `job`: String
- `education`: String
- `marital`: Enum (divorced, married, single, unknown)
- `contact_comunication`: String
- `housing_loan`: Enum (yes, no,unknown)
- `personal_loan`: Enum (yes, no,unknown)
- `has_credit`: Enum (yes, no,unknown)
- `last_day_contacted`: Enum (monday, tuesday, wednesday, thursday, friday,
  saturday, sunday)
- `last_month_contacted`: Enum (january, february, march, april, may, june,
  july, august, september,october, november, december)
- `how_many_contacted_now`: Int
- `how_many_contacted_previous` Int
- `days_last_contacted`: Int
- `result_of_last_campaign`: Enum (failure, nonexistent, success)
- `predictive_subscribe`: Enum (failure, nonexistent, success) => Filled based
  on ML Result
- `predictive_score_subscribe`: Float => Filled based on ML Result

## 🔧 Configuration

### CORS Configuration

By default, the server accepts requests from:

- Production: `https://asah.hapnanarsad.com`
- Development: `http://localhost:5173`

To modify CORS settings, edit `src/server.js`:

```javascript
routes: {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
        additionalHeaders: ['cache-control', 'x-requested-with'],
    },
}
```

### Session Configuration

Sessions are managed using `@hapi/yar` with the following settings:

- Cookie name: Managed by Yar
- Duration: 7 days
- Secure: `true` in production, `false` in development
- HttpOnly: `true` (XSS protection)
- SameSite: `Lax` (CSRF protection)

### Cache Configuration

Prisma Accelerate caching is configured with:

- Default TTL: 60 seconds
- Location: `src/plugins/prisma.js` and `src/services/prisma/authService.js`

To customize cache TTL:

```javascript
withAccelerate({
  cache: {
    ttl: 60, // seconds
  },
});
```

## 🏗️ Project Structure

```
asahCapstoneBE/
├── prisma/
│   ├── migrations/                    # Database migrations
│   │   ├── migration_lock.toml
│   │   ├── 20251119014147_init/
│   │   ├── 20251204122929_add_customer_table/
│   │   ├── 20251208170958_add_analitic_table/
│   │   ├── 20251209151834_add_predict_table/
│   │   ├── 20251209171516_change_datatype/
│   │   ├── 20251209173528_change_datatype_predict/
│   │   └── 20251210134828_remove_duration/
│   ├── schema.prisma                  # Prisma schema definition
│   └── seed.js                        # Database seeding script
├── src/
│   ├── api/
│   │   ├── analitics/                 # Analytics management
│   │   │   ├── handler.js             # Analytics route handlers
│   │   │   ├── index.js               # Plugin registration
│   │   │   └── routes.js              # Route definitions
│   │   ├── auth/                      # WebAuthn authentication
│   │   │   ├── handler.js             # Auth route handlers
│   │   │   ├── index.js               # Plugin registration
│   │   │   └── routes.js              # Route definitions
│   │   ├── customer/                  # Customer management
│   │   │   ├── handler.js             # Customer route handlers
│   │   │   ├── index.js               # Plugin registration
│   │   │   └── routes.js              # Route definitions
│   │   └── predict/                   # ML predictions
│   │       ├── handler.js             # Prediction route handlers
│   │       ├── index.js               # Plugin registration
│   │       └── routes.js              # Route definitions
│   ├── exeptions/                     # Custom error classes
│   │   ├── ClientError.js
│   │   ├── InvariantError.js
│   │   └── NotFoundError.js
│   ├── generated/
│   │   └── prisma/                    # Generated Prisma Client
│   │       └── runtime/
│   ├── plugins/
│   │   └── prisma.js                  # Prisma plugin configuration
│   ├── services/
│   │   ├── mechinelearning/           # ML services
│   │   │   └── mlServices.js          # ML API integration
│   │   ├── prisma/                    # Database services
│   │   │   ├── analiticService.js     # Analytics CRUD operations
│   │   │   ├── authService.js         # Auth database operations
│   │   │   ├── customerService.js     # Customer CRUD operations
│   │   │   └── predictService.js      # Prediction CRUD operations
│   │   └── redis/                     # Caching services
│   │       └── CacheService.js        # Redis cache operations
│   ├── validator/                     # Request validation schemas
│   │   └── auth/
│   │       ├── index.js
│   │       └── schema.js
│   └── server.js                      # Main server file
├── .env                               # Environment variables (create this)
├── jsonformatter.json                 # JSON formatting config
├── main.py                            # Python script (if applicable)
├── package.json                       # Dependencies and scripts
├── prisma.config.mjs                  # Prisma configuration
├── railway.json                       # Railway deployment config
├── tsconfig.prisma.json               # TypeScript config for Prisma
└── README.md                          # This file
```

## 🔐 Security Features

- ✅ **Passkey Authentication** - Passwordless login using WebAuthn
- ✅ **CORS Protection** - Configured allowed origins
- ✅ **HttpOnly Cookies** - XSS protection
- ✅ **SameSite Cookies** - CSRF protection
- ✅ **Secure Cookies** - HTTPS in production
- ✅ **Error Handling** - Custom error classes and handlers

## 🚢 Deployment

### Production Checklist

1. ✅ Set `NODE_ENV=production` in environment variables
2. ✅ Use production Prisma Accelerate connection
3. ✅ Update CORS origins to production domain
4. ✅ Ensure Redis is accessible
5. ✅ Run migrations: `npm run migrate:deploy`
6. ✅ Generate client: `npm run generate`
7. ✅ Start server: `npm run start:prod`

### Environment Variables for Production

```env
NODE_ENV=production
DIRECT_DATABASE_URL="postgresql://user:password@prod-host:5432/asah_db"
REDIS_URL="redis://prod-redis:6379"
PORT=3000
HOST=0.0.0.0
```

## 📚 Additional Resources

- [Prisma v7 Documentation](https://www.prisma.io/docs)
- [Prisma Accelerate Setup](./ACCELERATE_SETUP.md)
- [Hapi.js Documentation](https://hapi.dev/api/)
- [SimpleWebAuthn Docs](https://simplewebauthn.dev/)
- [WebAuthn Guide](https://webauthn.guide/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

ISC

## 👥 Authors

- GitHub: [@hapnan](https://github.com/hapnan), [@TatakAdi](https://github.com/TatakAdi)

---

**Happy Coding! 🚀**
