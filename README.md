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

const options = { insertAt: 'top' };

styleImplant(css, options);
```

## Options

```javascript
{
  insertAt?: string = 'bottom';
}
```

- `insertAt`: When `'top'` style tags will be implanted in the top of the head rather than the bottom. _Warning: This will reverse the order in which tags load as the newest tag will always be first instead of last._

## License

Based on [style-inject](https://github.com/egoist/style-inject) by [EGOIST](https://github.com/egoist)

Licensed under the [MIT license](https://opensource.org/licenses/MIT)

&copy; 2021 [Ivo Ilić](https://github.com/ivoilic)
