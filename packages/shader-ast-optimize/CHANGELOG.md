# Change Log

- **Last updated**: 2024-02-10T08:59:57Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [0.3.27](https://github.com/thi-ng/umbrella/tree/@thi.ng/shader-ast-optimize@0.3.27) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

## [0.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/shader-ast-optimize@0.3.0) (2023-05-24)

#### 🚀 Features

- update constant folding ([1bd5fef](https://github.com/thi-ng/umbrella/commit/1bd5fef))
  - add simplifications for 0/1 cases

## [0.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/shader-ast-optimize@0.2.0) (2021-11-17)

#### 🚀 Features

- Using workspaces for local tools ([bf7a404](https://github.com/thi-ng/umbrella/commit/bf7a404))
  Improving the overall build ergonomics
  - introduced a tools workspaces
  - imported it in all needed packages/examples
  - inclusive project root

#### ♻️ Refactoring

- testrunner to binary ([4ebbbb2](https://github.com/thi-ng/umbrella/commit/4ebbbb2))
  this commit reverts (partly) changes made in:
  ef346d7a8753590dc9094108a3d861a8dbd5dd2c
  overall purpose is better testament ergonomics:
  instead of having to pass NODE_OPTIONS with every invocation
  having a binary to handle this for us.

### [0.1.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/shader-ast-optimize@0.1.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/shader-ast-optimize@0.1.0) (2021-10-12)

#### 🚀 Features

- extract as own pkg ([b71cd16](https://github.com/thi-ng/umbrella/commit/b71cd16))
