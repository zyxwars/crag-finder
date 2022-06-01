## Dev setup

### Environment variables

Store in .env as prisma migrate didn't find .env.local

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/crag?schema=public"
UPLOAD_DIR=/home/USER/crag-finder/uploads
NEXTAUTH_SECRET=secret
NEXTAUTH_URL=https://example.com
```

### Setup database

Clear db and apply all migrations

```
npx prisma migrate reset
```
