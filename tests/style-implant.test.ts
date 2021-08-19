import { expect } from 'chai';
import { placeholder } from '../src/style-implant';

describe('style-implant unit tests', (): void => {
  it('input true', (): void => {
    const result: boolean = placeholder(true);
    expect(result).is.equal(false);
  });
  it('input false', (): void => {
    const result: boolean = placeholder(false);
    expect(result).is.equal(true);
  });
});
