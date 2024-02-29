# [3.0.0-next.1](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/3.0.0-next.0...3.0.0-next.1) (2024-02-29)


### Features

* sanitizer handle regex ([97120d5](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/97120d56e80c105ffd032a9a962d908d522a5d9a))



# [3.0.0-next.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.2.1...3.0.0-next.0) (2024-02-27)


### Bug Fixes

* async regression remove require and use import ([e2f7f18](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/e2f7f1844d68225dfaf53c4d18009acf91ceea23))
* **dependencies:** correct vulnerabilities and remove unmaintened deps ([142c7f9](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/142c7f9c8128091347d1c5bb3121c1d02ecbabf3))


### Features

* **logger:** ajuster log info ([2545330](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/2545330942a354b8dcb0c1121c04daa58cbd8077))



## [2.2.3](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.2.2...2.2.3) (2024-06-25)


### Bug Fixes

* Nodejs engine downgrade minimal requirement to v16 ([52a3916](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/52a391626f8c268a26d7b4a28ec68b7ed141a2c2))



## [2.2.2](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.2.1...2.2.2) (2024-06-25)


### Bug Fixes

* **config:** readConfig add a return for the config ([20dfd4c](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/20dfd4cdfb3c5d5c89eb88002668726ef1dbac4b))
* **utils:** infer the return type from the property ([91b350a](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/91b350a28acfec1570b316db99b0347e2f9d76ed))



## [2.2.1](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.2.0...2.2.1) (2023-11-17)


### Bug Fixes

* **plugins:** load plugins async ([d1359fb](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/d1359fb69e990141533122bbb206887093cb4698))



# [2.2.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.1.5...2.2.0) (2023-11-02)


### Features

* **db:** add searchPath and schema support ([acc4f98](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/acc4f98391f072359c20c89bd5af26d4b9dc3531))



## [2.1.5](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.1.4...2.1.5) (2023-10-23)


### Features

* **sanitizer:** sanitize html attribute value ([ce8df3b](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/ce8df3bb8fbb864e7e378aad7ab64c0b82bc8182))



## [2.1.4](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.1.3...2.1.4) (2023-10-20)


### Features

* **database:** add proxy config ([cd18373](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/cd183736be558ad76136fae23af5da85752b1d19))
* **database:** add proxy config ([0ed460b](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/0ed460b1e0064c981c633de3b7fd047c9aa4532e))



## [2.1.3](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.1.2...2.1.3) (2023-10-20)


### Features

* **database:** force ssl when proxyHost ([04c1483](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/04c1483de2c66fc7be1bbfe748bebb2f0c43fc5f))



## [2.1.2](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.1.1...2.1.2) (2023-10-20)


### Bug Fixes

* **cache:** add obsolete replicats config ([aed0997](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/aed099766da6885677dfdae396201c0b053b9ed9))


### Features

* **cache:** add tls ([c5af649](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/c5af6498cdafd62ceae9aed708cef2b90484a261))



## [2.1.1](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.1.0...2.1.1) (2023-10-20)


### Features

* **database:** add ssl param and timeout optional ([a09fa74](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/a09fa74172675b95d72f1a9227ff02fe2d281d31))



# [2.1.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.0.4...2.1.0) (2023-10-16)


### Bug Fixes

* **security:** add security headers ([69a9249](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/69a9249ca5727e6794649158eab88f552640d2f9))



## [2.0.4](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.0.3...2.0.4) (2023-10-16)


### Bug Fixes

* **swagger:** default base path ([8598344](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/859834489755ca2d239d0b129587372fe7b4bb58))



## [2.0.3](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.0.2...2.0.3) (2023-10-12)


### Bug Fixes

* **cache:** fix cache after update ([fad896a](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/fad896a5ab91a6fdec4f356c24dc9d2a87e34c17))



## [2.0.2](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.0.1...2.0.2) (2023-10-12)


### Bug Fixes

* **sequelize:** global error handler ([9f5f61e](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/9f5f61eca412ac5b1027fad1fdf89d439e294763))



## [2.0.1](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/2.0.0...2.0.1) (2023-10-11)


### Bug Fixes

* **any:** remove any type ([8a8d768](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/8a8d7685584af8878b8ada879034472d2065aff2))
* **any:** remove any type ([f1942ca](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/f1942ca32f533122d1576dcfb21cd002bcb6a7fb))



# [2.0.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.7.0...2.0.0) (2023-10-11)


### Features

* **deps:** upgrade dependencies ([dfdbf89](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/dfdbf89228c4422d4f5ca9343c3b2097b8942216))
* **eslint:** change tslint to eslint ([b5408a7](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/b5408a799a7cd893378503feb15205ae653f5cc8))



# [1.7.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.6.0...1.7.0) (2023-09-25)


### Bug Fixes

* **db:** remove old prop ([2c7df25](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/2c7df25dfdd3fb03051ea01b8f414bb4363a6efe))



# [1.6.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.5.0...1.6.0) (2023-05-31)


### Features

* **config:** can now use env variable and argument variable ([5588009](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/5588009fac1df4f6e43237903df64127a2886e46))



# [1.5.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.4.0...1.5.0) (2023-05-24)


### Features

* **mail:** add aws ses support ([94622e1](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/94622e178334a94aba51fb6af4d93e34521b6b45))



# [1.4.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.3.0...1.4.0) (2023-05-09)



# [1.3.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.2.3...1.3.0) (2023-05-09)



## [1.2.3](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.2.2...1.2.3) (2023-04-14)



## [1.2.2](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.2.1...1.2.2) (2022-06-21)


### Bug Fixes

* **cookie:** ignore invalid cookies ([fa425d6](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/fa425d6fb129f1df104c0575e638805e45616264))


### Features

* **node:** compatible with v16 ([f1b6114](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/f1b61140f1665fe7145223ab4d9972f73d5d595f))



## [1.2.1](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.2.0...1.2.1) (2022-03-15)


### Bug Fixes

* ignore function ([b3f9170](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/b3f91703bc08ba4a621fe2c9b79c395b0f9da3f2))
* **sanitizer:** fix readabled array stringify ([5c7b4dd](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/5c7b4dd7b869e1fc71e7a293d16fb9c489619510))



# [1.2.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.1.2...1.2.0) (2022-02-28)


### Features

* **node:** upgrade to 16 ([14e5378](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/14e53781a21189d3aa58926c90a74e689d797607))



## [1.1.2](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.1.1...1.1.2) (2022-02-22)


### Bug Fixes

* **cache:** fix timeout when no config ([85600cd](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/85600cd82a4aae67a824a039a26b8550e316318c))



## [1.1.1](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.1.0...1.1.1) (2022-02-22)


### Bug Fixes

* **database:** improve database error in log ([2574859](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/25748593b66333cf4d339991e4808628b04535ab))


### Features

* **cache:** add config to change timeout when adding cache ([fa2bef4](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/fa2bef4be321de0566567581e532d4de9ed38d31))
* **database:** add request db timeout ([b9c52fd](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/b9c52fd858f3ced82387c0a51f358ba317a90879))



# [1.1.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.12...1.1.0) (2021-12-02)


### Bug Fixes

* **cache:** this undefined and delete promise ([98a9e52](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/98a9e52980b69e932aa8a48db22f4532cdd82f51))



## [1.0.12](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.11...1.0.12) (2021-06-03)


### Bug Fixes

* **JoiPlus:** fix when validation pass twice ([5adc8bc](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/5adc8bc3792fc72222d28a0899f465932750dc57))



## [1.0.11](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.10...1.0.11) (2021-05-28)


### Features

* **PostgresConfiguration:** add pool configuration ([15d0d52](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/15d0d5284032dcebda0c72cfc295ecad9164183e))



## [1.0.10](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.9...1.0.10) (2021-03-18)


### Bug Fixes

* **JoiPlus:** fix geojson was a string ([bc359f2](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/bc359f2a47080f1bfe47ea5cc8c480d12e7cc53e))



## [1.0.9](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.8...1.0.9) (2021-03-15)


### Features

* **serveur:** wait load completed ([df0096d](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/df0096d8c0febf2e78b3384794829cc2d8b25586))



## [1.0.8](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.7...1.0.8) (2021-03-10)


### Bug Fixes

* **catbox-redis:** fix import ([275364f](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/275364fe6f250bdd4b840d20cac2b437176e730c))



## [1.0.7](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.6...1.0.7) (2021-03-10)


### Features

* **catbox-redis:** update to 6.0.2 ([a30101b](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/a30101bf95d93d8989bbfab28d967a993183d748))
* **plugin-health:** remove hapi-alive dep ([618b533](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/618b5336ce9b571a53cebc9df9b2d00189b81fba))
* **plugin-sanitizer:** sanitize string payload ([70533fe](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/70533fe01264d38e74d96e2004edd38754768cab))



## [1.0.6](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.5...1.0.6) (2021-03-09)


### Bug Fixes

* **user.validator:** return a promise ([b2affd4](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/b2affd4ec1ecfa100b43babb33ed6d3390dbf28b))



## [1.0.5](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.4...1.0.5) (2021-03-09)



## [1.0.4](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.3...1.0.4) (2021-03-08)



## [1.0.3](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.2...1.0.3) (2021-03-08)


### Bug Fixes

* **datasource:** fix path model ([fbb2518](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/fbb2518d930564082758ac49c1926535561ee411))



## [1.0.2](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.1...1.0.2) (2021-03-08)


### Bug Fixes

* **plugins:** fix options plugins ([047f649](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/047f6499e812657b370d27544b9628419e616d60))


### Features

* **Joi:** add bbox ([262b7c4](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/262b7c4dfdac80475c735a351c2205a77827f7d6))



## [1.0.1](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.0...1.0.1) (2021-03-05)


### Bug Fixes

* fix version ([23afedc](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/23afedc0aa90def4161dd172cf8542f7d2fdaf06))



# [1.0.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/1.0.0-alpha.0...1.0.0) (2021-03-05)



# [1.0.0-alpha.0](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/0.1.5...1.0.0-alpha.0) (2021-03-05)


### Features

* **upgrade:** all ibs ([cc7987d](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/cc7987d1d066df75f2579bc51e1346edd1894d12))



## [0.1.5](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/0.1.4...0.1.5) (2021-03-04)


### Bug Fixes

* **database:** no database ([64a26e8](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/64a26e896522179fe260d739647833f2f350ee88))



## [0.1.4](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/0.1.3...0.1.4) (2021-03-03)



## [0.1.3](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/0.1.2...0.1.3) (2021-03-03)


### Features

* **apm:** add pathReplace option ([a03a630](https://gitlab.forge.gouv.qc.ca/igo2/base-api/commit/a03a63047bb27a8f80ab834a998868337e76339d))



## [0.1.2](https://gitlab.forge.gouv.qc.ca/igo2/base-api/compare/0.1.1...0.1.2) (2021-03-03)



## 0.1.1 (2021-03-03)



