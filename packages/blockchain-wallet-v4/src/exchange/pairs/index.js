import BigRational from 'big-rational'
import { compose, curry, is, map, prop } from 'ramda'
import { view } from 'ramda-lens'

import Type from '../../types/Type'

export class Pairs extends Type {
  toString() {
    return `Pairs(${this.code})`
  }
}

export const isPairs = is(Pairs)

export const table = Pairs.define('table')
export const selectTable = view(table)

export const code = Pairs.define('code')
export const selectCode = view(code)
export const selectRate = (code, pairs) => prop(code, selectTable(pairs))

export const create = curry((code, tickerPairs) => {
  const table = map(compose(BigRational, prop('last')), tickerPairs)
  return new Pairs({ code, table })
})
