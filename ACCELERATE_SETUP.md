# Prisma Accelerate with Caching - Setup Guide

## 🚀 Configuration Complete!

Your project is now configured to use **Prisma Accelerate with caching** in Prisma v7.

## 📋 Required Environment Variables

You need to set up two database URLs in your `.env` file:

### 1. **DATABASE_URL** (Accelerate Connection)

This is your Prisma Accelerate connection string for runtime queries with caching.

**Get it from:** https://console.prisma.io/

**Format:**

```
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
```

### 2. **DIRECT_DATABASE_URL** (Direct Connection)

This is your direct PostgreSQL connection for running migrations.

**Format:**

```
DIRECT_DATABASE_URL="postgresql://user:password@host:5432/database"
```

## 🔧 Setup Steps

### 1. Create Prisma Accelerate Project

1. Go to https://console.prisma.io/
2. Create a new project
3. Connect your PostgreSQL database
4. Copy your Accelerate connection string

### 2. Update Your `.env` File

```env
# Prisma Accelerate Connection (with caching)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# Direct PostgreSQL Connection (for migrations)
DIRECT_DATABASE_URL="postgresql://user:password@localhost:5432/your_database"

# Redis
REDIS_URL="redis://localhost:6379"

# Server
PORT=3000
HOST=localhost
NODE_ENV=development
```

### 3. Generate Prisma Client

```bash
npm run generate
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Start Your Server

```bash
npm run start:dev
```

## ✨ Caching Configuration

The default cache TTL is set to **60 seconds** in:

-   `src/plugins/prisma.js`
-   `src/services/prisma/authService.js`

You can customize the cache settings:

```javascript
withAccelerate({
    cache: {
        ttl: 60, // Cache time-to-live in seconds
    },
});
```

## 📊 Using Cached Queries

To use caching with your queries, add the `cacheStrategy` option:

```javascript
// Cache for 60 seconds
const user = await prisma.user.findUnique({
    where: { id: '123' },
    cacheStrategy: {
        ttl: 60,
        swr: 300, // Stale-while-revalidate
    },
});
```

## 🔄 Benefits of Prisma Accelerate + Caching

-   ⚡ **Faster queries** - Cached results return instantly
-   🌍 **Global CDN** - Reduced latency worldwide
-   📈 **Reduced database load** - Fewer queries hit your database
-   🔒 **Connection pooling** - Optimized for serverless/edge

## 📚 Resources

-   [Prisma Accelerate Docs](https://www.prisma.io/docs/accelerate)
-   [Caching Guide](https://www.prisma.io/docs/accelerate/caching)
-   [Migration Guide](https://www.prisma.io/docs/guides/upgrade-guides/upgrading-to-prisma-7)

---

**Note:** Your project is using Prisma v7 with Accelerate + Caching enabled. This is the recommended setup for applications that need caching capabilities.
