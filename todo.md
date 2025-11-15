# TODO

- [x] get express
- [x] make express handle the usual param and any kind of input, dto, param and query be validated
- [x] add git hook to format and lint (default prettier + typescript lint)
- [x] make 1 resource crud
- [x] add unit test and run it on github action
- [x] add postman e2e and run it on github action
- [x] use github action to run tests, formats and lints
- [x] pick mikroorm where we can control commit and flushes
- [x] standardized the responses shape, error and usual ones
- [x] add .env for db config
- [x] add pagination
- [x] add bash local start
- [x] add adminer
- [x] add logger
- [x] add demon to auto restart app on change, its so annoying
- [x] delete all waffle stuff, work on the real business schema
- [ ] add auth
- [x] add sort by in list filter
- [x] make a cli to make making new domain easier, just replace the word waffle with dynamic param
- [x] fix inconsistent naming convention
- [x] add swagger
- [x] increase unit test to 100%
- [ ] can 1 person have multi address and phone? if so make table for it
- [ ] add deleted status, soft delete to all tables that needs it

* **Files & folders:** `kebab-case`
* **Variables & functions:** `camelCase`
* **Classes & types:** `PascalCase`
* **Constants & env vars:** `UPPER_SNAKE_CASE`
* **Tests:** mirror source, end with `.test.ts`
