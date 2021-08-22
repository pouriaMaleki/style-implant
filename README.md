# style-implant

[![NPM version](https://img.shields.io/npm/v/style-implant.svg?style=flat)](https://npmjs.com/package/style-implant) [![NPM downloads](https://img.shields.io/npm/dm/style-implant.svg?style=flat)](https://npmjs.com/package/style-implant)

Implant style tags where you need them.

## Installation

```bash
yarn add style-implant
```

```bash
npm install style-implant
```

## Example

```javascript
import styleImplant from 'style-implant';

const css = `
  body {
    margin: 0;
  }
`;

const options = {
  attributes: { 'data-implanted': '💉' },
  insertAt: 'top',
  preserveOrder: true,
};

styleImplant(css, options);
```

## Options

```javascript
{
  attributes?: {string: string};
  insertAt?: string = 'bottom';
  preserveOrder?: boolean = false;
}
```

- `attributes`: Takes an object where the keys are attribute names and the values are the attribute values.
- `insertAt`: When `'top'` style tags will be implanted in the top of the head rather than the bottom. _Warning: This will reverse the order in which tags load as the newest tag will always be first instead of last._
- `preserveOrder`: When enable multiple style tags will be implanted in order from oldest to newest within the same parent element. This option is disabled by default to match the output of `style-inject` but it's reccomended that you enable it for a better experience. Future versions may enable this by default.

## Replacing `style-inject`

`style-implant` was designed to be a drop in replacement for `style-inject`. All versions until `v0.4.0` of `style-implant` will not cause breaking changes for previous users of `style-inject`. These versions will only add more options. This package improves on `style-inject` by adding critical options, TypeScript support, and tests!

## License

Based on [style-inject](https://github.com/egoist/style-inject) by [EGOIST](https://github.com/egoist)

Licensed under the [MIT license](https://opensource.org/licenses/MIT)

&copy; 2021 [Ivo Ilić](https://github.com/ivoilic)
