# [1.3.0-beta.1](https://github.com/riccardoperra/ngx-reactive-loading/compare/v1.2.0...v1.3.0-beta.1) (2021-08-19)


### Features

* add `untilLoading` reactive helper ([190761d](https://github.com/riccardoperra/ngx-reactive-loading/commit/190761d5f5323c5ee563807316272036b0f21092))

# [1.2.0](https://github.com/riccardoperra/ngx-reactive-loading/compare/v1.1.1...v1.2.0) (2021-08-17)


### Features

* add `toEvent` util ([471ec15](https://github.com/riccardoperra/ngx-reactive-loading/commit/471ec15e417905395380811ebc0978146970148c))
* add loading service duplicate key error ([53cd43a](https://github.com/riccardoperra/ngx-reactive-loading/commit/53cd43a727947f866e1efdd77617915e98b61669))

## [1.1.1](https://github.com/riccardoperra/ngx-reactive-loading/compare/v1.1.0...v1.1.1) (2021-07-25)


### Bug Fixes

* throw error if someLoading identifier does not exists ([6049767](https://github.com/riccardoperra/ngx-reactive-loading/commit/60497677c55d1dc73a8bfbc684b956a3b1366409))

## [1.1.1](https://github.com/riccardoperra/ngx-loading/compare/v1.1.0...v1.1.1) (2021-07-25)


### Bug Fixes

* throw error if someLoading identifier does not exists ([6049767](https://github.com/riccardoperra/ngx-loading/commit/60497677c55d1dc73a8bfbc684b956a3b1366409))

# [1.1.0](https://github.com/riccardoperra/ngx-loading/compare/v1.0.5...v1.1.0) (2021-07-24)


### Bug Fixes

* add loading store module options ([fba65bd](https://github.com/riccardoperra/ngx-loading/commit/fba65bd6eef55f2f719b23f9af3a28d911d0e440))
* export SOME_LOADING token ([e267d96](https://github.com/riccardoperra/ngx-loading/commit/e267d9618d39aae05f1a1d26cf1833a8c3ca1fac))
* remove cyclic dependencies ([6a08b46](https://github.com/riccardoperra/ngx-loading/commit/6a08b46d6483802c3f836f39de10e10ce0dfded7))


### Features

* add logger.service.ts, add module with logger test, fix token type ([c837246](https://github.com/riccardoperra/ngx-loading/commit/c837246b6fb7cde85e4b7432a1c0f69901575301))
* add module loading logger ([1672954](https://github.com/riccardoperra/ngx-loading/commit/16729547186edd1014256045b0f824c75b721801))

## [1.0.5](https://github.com/riccardoperra/ngx-loading/compare/v1.0.4...v1.0.5) (2021-07-20)


### Bug Fixes

* fix `LOADING_STORE_OPTIONS` token type ([c2d760d](https://github.com/riccardoperra/ngx-loading/commit/c2d760daa1000088eb5ed3cf65343a8b02ff2a88))

## [1.0.4](https://github.com/riccardoperra/ngx-loading/compare/v1.0.3...v1.0.4) (2021-07-20)


### Bug Fixes

* fix forFeature module typing ([ac057e9](https://github.com/riccardoperra/ngx-loading/commit/ac057e911133068294ed542c2d7f4b4aaae59991))

## [1.0.3](https://github.com/riccardoperra/ngx-loading/compare/v1.0.2...v1.0.3) (2021-07-18)


### Bug Fixes

* fix README.md ([5effddd](https://github.com/riccardoperra/ngx-loading/commit/5effdddafaf328fd182129712229f2ee75f58182))

## [1.0.2](https://github.com/riccardoperra/ngx-loading/compare/v1.0.1...v1.0.2) (2021-07-18)


### Bug Fixes

* add support for angular v10+ ([4b6d87a](https://github.com/riccardoperra/ngx-loading/commit/4b6d87a7b7aa2739f8de0bb6655944dd3675108b))

## [1.0.1](https://github.com/riccardoperra/ngx-loading/compare/v1.0.0...v1.0.1) (2021-07-18)


### Bug Fixes

* fix track error message type-error ([aefe897](https://github.com/riccardoperra/ngx-loading/commit/aefe897dddf3f720e235be802719de1980dcad70))
* removed isInitialized property in loading.service ([6489fdd](https://github.com/riccardoperra/ngx-loading/commit/6489fdd9343706d6b0c42a0ba45ddcd13e30b3db))

# 1.0.0 (2021-07-18)


### Bug Fixes

* add provider export ([e053f39](https://github.com/riccardoperra/ngx-loading/commit/e053f396fe844c99f93e68544f4cf326dd4c3b20))
* fix models and removed providedIn any to loading service ([c89d999](https://github.com/riccardoperra/ngx-loading/commit/c89d99921d8e4e12cadc6f510e6bce2afe12594f))
* removed [@internal](https://github.com/internal) to property tuple type ([c4979f5](https://github.com/riccardoperra/ngx-loading/commit/c4979f5da0835e96d37cbe71b70f6d2837197d07))


### Features

* add loading module forRoot/forChild and improved loading service dependency injection ([8f4e86e](https://github.com/riccardoperra/ngx-loading/commit/8f4e86eef1d4bbdadd5f178947c76e8b170ce466))
* add loading service implementation ([a00c63d](https://github.com/riccardoperra/ngx-loading/commit/a00c63dddb46a57da8d1ce754427a20943669424))
* add loading store ([d7371a6](https://github.com/riccardoperra/ngx-loading/commit/d7371a611f98d01238a0df4af3f4505aba0291e4))
* add some loading observable creator, add type-safe guards ([ca2138c](https://github.com/riccardoperra/ngx-loading/commit/ca2138c1593e4c839b18f57de7cc39da15c79dac))
* export loading initial value token and service provider ([221a1f2](https://github.com/riccardoperra/ngx-loading/commit/221a1f2d83bb25e4a467c92c71e23dcbfb2447b0))
* improved typings ([c2bcc17](https://github.com/riccardoperra/ngx-loading/commit/c2bcc1717f60b7f088a0050e30bc1ced052c3999))
