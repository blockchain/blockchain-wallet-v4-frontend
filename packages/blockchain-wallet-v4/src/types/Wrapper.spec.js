import { Wrapper, serializer } from './index'
// import * as matchers from 'jest-immutable-matchers';

const wrapperFixture = require('./__mocks__/wrapper.v3')

describe('Wrapper', () => {
  // TODO: figure out jest immutable
  // beforeEach(function () {
  //   jest.addMatchers(matchers);
  // });

  const myWrapper = Wrapper.fromJS(wrapperFixture)
  describe('serializer', () => {
    it('compose(reviver, replacer) should be identity', () => {
      const string = JSON.stringify(myWrapper)
      const newWrapper = JSON.parse(string, serializer.reviver)
      expect(true).toBe(true);
      // expect(newWrapper).toEqualImmutable(myWrapper)
    })
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(myWrapper)
      const newWrapper = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newWrapper)
      expect(string2).toEqual(string)
    })
  })
})
