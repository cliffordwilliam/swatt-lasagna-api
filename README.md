<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

---

## Migrating

Do not forget to generate first

Also do not forget to update the dto, dto is separate because that is the only way the nestjs built in validationpipe going to work, otherwise there is not validation at all

```bash
npx prisma generate
```

To remote

```bash
npx prisma migrate dev --name [MIGRATION_NAME]
```

To local

```bash
dotenv -e .env.local -- npx prisma migrate dev --name [MIGRATION_NAME]
```

## Running

To remote

```bash
npm run start:dev
```

To local

```bash
npm run start:local
```

## Seeding

Seeding script is ran when you migrate, and when there is conflict. So I decided to run it once only. The seed script will still be there but the logic will be commented out

I just find it tedious that when someone patch the item, then I also need to update the seeding item values too to prevent me overriding the patched data with the auto seed during future migrate

If you want to update again, just patch the data

Seed local

```bash
dotenv -e .env.local -- npx prisma db seed
```

Seed remote

```bash
npx prisma db seed
```

---

## Info

Add pgbouncer=true to the env connection strings, this mitigates the following issue

Prepared statement already exists

Reference

https://github.com/umami-software/umami/issues/927

---

## Todo list:

- [x] All basic crud
- [x] Authentication
- [x] Authorization
- [x] Error handler
- [x] Pagination
- [x] Cors
- [x] Helmet
- [ ] CSRF Protection -> Not working?
- [x] Rate Limiting
- [ ] Cron - for deleting old data
- [x] Swagger -> TODO: Works but all are auth, cannot sign in either needs token for body but body is not availablle
- [ ] Testing all
- [ ] Refrash token -> TODO: Maybe no need, just re login every 15 minutes no problem
