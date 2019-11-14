'use strict'

const CSP = require(`./ContentSecurityPolicy`)

it(`replaceNonce`, () => {
  expect(CSP.replaceNonce({}, `string`)).toEqual(`string`)
})
