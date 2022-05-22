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

# Api

## /auth

### /auth/register

POST
Create user

### /auth/[...nextauth]

## /crags

POST
Create crag\
GET
Get crags

### /crags/[cragId]

PUT
Not implemented\
DELETE
Delete crag

### /crags/[cragId]/photos

POST\
GET

### /crags/[cragId]/comments

POST\
GET

### /crag/[cragIc]/visits

POST
Not implemented\
GET
Not implemented

## /comments/[commentId]

POST
Create reply\
DELETE
Not implemented

## /photos/[photoId]

DELETE
Not implemented\
GET
Not implemented

## /visits/[visitId]

PUT
Not implemented\
DELETE
Not implemented\
GET
Not implemented
