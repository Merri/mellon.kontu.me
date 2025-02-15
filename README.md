I've decided that I simply can't work on this project. I've had to stretch myself too thin in the past few years so it is better to just let some things go.

---

# Mellon

An app to manage meetups. Currently only in Finnish language and on Finnish timezone (EEST).

Based on a lot of cool open source tech:

-   Astro SSR
-   PostgreSQL
-   SolidJS
-   TypeScript

Initially based on a [Astro + SolidJS CodeSandbox template](https://github.com/Merri/codesandbox-astro-solidjs-playground).

## Getting started

Clone the project.

### Install dependencies

This project uses Yarn. The following is enough to install the deps:

```bash
yarn
```

Please also use Yarn if you are planning to contribute.

### Setting up environment variables

During development this project requires a `.env` file. The following keys are required:

```env
BUGSNAG_API_KEY=""
JWT_DATABASE="SecretForJwtStoredToDatabase"
JWT_SECRET="SecretForTheVariousAuthJwts"
TOMTOM_API_KEY=""

POSTGRES_HOST="localhost"
POSTGRES_PORT=5432
POSTGRES_DB=""
POSTGRES_USER=""
POSTGRES_PW=""

PRIMARY_EMAIL_HOST="smtp.YOURHOST.DOMAIN"
PRIMARY_EMAIL_PORT=465
PRIMARY_EMAIL_NAME="Mellon"
PRIMARY_EMAIL_FROM="mellon@kontu.me"
PRIMARY_EMAIL_USER=""
PRIMARY_EMAIL_PW=""
```

-   **JWT** is based on a private secret. Change the key to whatever for your development use.
-   **Bugsnag** is used for tracking errors. Unlike most other similar tracking services it has a free plan for hobbyist
    use. [Go create yourself an account!](https://www.bugsnag.com/), create an app (Mellon), and provide the API key.
-   **TomTom** provides static map images. You can [create yourself a free account](https://developer.tomtom.com/) and
    create an API key.
-   **Email** can be any SMTP you have an access to. Or create an [Ethereal user](https://ethereal.email/) for debug
    only.
-   **PostgreSQL** is the database of choice. As of writing the database schema is not yet available, please ask Merri
    to provide it. (You might also be able to use TypeScript types to figure things out the hard way.)

### Running development

You can boot up the app for development using:

```bash
yarn dev
```

### Running on CodeSandbox

Yarn is used in this project to have easy CodeSandbox support.

The following command is reserved for CodeSandbox use:

```bash
yarn start
```

While possible to run in a CodeSandbox it is recommended to run a local development copy instead.
