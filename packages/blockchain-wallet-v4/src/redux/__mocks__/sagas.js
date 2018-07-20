import { map, mapObjIndexed } from 'ramda'

const createSagas = require.requireActual('../sagas').default

const mockFunctionsDeep = attr => {
  // Mock
  if (typeof attr === 'function') return jest.fn()

  // Go deeper
  if (Array.isArray(attr)) return map(mockFunctionsDeep, attr)
  if (attr.toString() === '[object Object]') {
    return mapObjIndexed(mockFunctionsDeep, attr)
  }

  // Return value in case of literals
  return attr
}

export default ({ api } = { api: {} }) =>
  mockFunctionsDeep(createSagas({ api }))
