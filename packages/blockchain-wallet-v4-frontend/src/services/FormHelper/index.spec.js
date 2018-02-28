import * as FormHelper from './index.js'

describe('required()', () => {

  test('return undefined if no value passed', () => {
    let v = FormHelper.required(null)
    expect(v).toEqual('Required')
  })
})
