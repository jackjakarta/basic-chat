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

Run this script to fetch the env vars from aws secrets manager (pass 'prod' instead for prod env vars):

```sh
chmod +x ./scripts/fetch-env.sh && ./scripts/fetch-env.sh local
```

You can start a local postgres instance using docker compose:

```sh
docker compose up -d postgres  # start
docker compose down  # stop
docker compose down --volumes  # clear db
```

If you want to test emails you should set `DEV_MODE` to true in the env vars and start the mailhog server as well.

```sh
docker compose up -d
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
