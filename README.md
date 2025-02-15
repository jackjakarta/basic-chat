# Next.js Template

## Requirements

- [fnm](https://github.com/Schniz/fnm)

## Usage

Before the application can be started, you need to install the necessary tools.

```sh
fnm use # set node version
corepack enable && corepack prepare # set package manager
pnpm i # install dependencies
```

You can start a local postgres instance using docker compose:

```sh
docker compose up -d postgres  # start
docker compose down  # stop
docker compose down --volumes  # clear db
```

You will also need to bring the database up to date by migrating it:

```sh
pnpm db:migrate
```

You can now start the application:

```sh
pnpm dev
```

## Code checks and format:

Checks:

```sh
pnpm checks
```

Code format:

```sh
pnpm format
```

## ENV Template

```
DATABASE_URL=postgresql://postgres:h4yuasd6@127.0.0.1:5432/local-nextjs
NEXTAUTH_URL=http://127.0.0.1:3000
NEXTAUTH_SECRET=secret-random-string
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_PASSWORD_VALIDATOR=weak
```
