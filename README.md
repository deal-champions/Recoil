# Why this fork?

We need to use recoil in a React Native project. As of v 0.0.10 there is still an open PR with the changes needed for React NAtive support. However, that PR needed master to merged in. Further more, the `dist` folder is not included in the original repo, hence, if you are using a github link to import this library, it will not have the built libraries.

Furthermore, the build process was failing due to a misconfiguration with the `Recoil_sprintf` file, which was removed.

This fork fixes these problems and creates a `dist` with the compiled version of the library, so you can use it directly in your projects:

```
yarn add deal-champions/Recoil
```

# Recoil &middot; [![Node.js CI](https://github.com/facebookexperimental/Recoil/workflows/Node.js%20CI/badge.svg)](https://github.com/facebookexperimental/Recoil/actions) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebookexperimental/Recoil/blob/master/LICENSE)

Recoil is an experimental set of utilities for state management with React.

Please see the website: https://recoiljs.org

## Installation

The Recoil package lives in [npm](https://www.npmjs.com/get-npm). To install the latest stable version, run the following command:

```shell
npm install recoil
```

Or if you're using [yarn](https://classic.yarnpkg.com/en/docs/install/):

```shell
yarn add recoil
```

## Contributing

Development of Recoil happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Recoil.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

Recoil is [MIT licensed](./LICENSE).
