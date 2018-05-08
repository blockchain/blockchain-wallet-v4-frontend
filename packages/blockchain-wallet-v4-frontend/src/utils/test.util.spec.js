import { testPropTypes } from 'utils/test.utils'
import React from 'react'

describe('Test.Utils', () => {
  describe('testPropTypes()', () => {
    /* eslint-disable */
    const fakeComponent = props => {
      return <div size={props.size} weight={props.weight} deepObj={props.obj} onClick={() => console.log('click')}/>
    }
    /* eslint-enable */

    it('should test that valid prop types are valid', () => {
      expect(testPropTypes(fakeComponent, 'size', ['test', 1, '14px'], false)).toBeTruthy()
      expect(testPropTypes(fakeComponent, 'weight', ['test', 13, ''], false)).toBeTruthy()
      expect(testPropTypes(fakeComponent, 'deepObj', [{test: {}}], false)).toBeTruthy()
      expect(testPropTypes(fakeComponent, 'onClick', [jest.fn()], false)).toBeTruthy()
    })

    it('should test that invalid prop types are invalid', () => {
      expect(testPropTypes(fakeComponent, 'onClick', [0, undefined, null, {}], true)).toBeTruthy()
    })
  })
})
