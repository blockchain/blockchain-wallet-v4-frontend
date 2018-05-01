import { map } from 'ramda'
import { renameKeys } from './index.js'
import { languagesSortedByName } from 'services/LanguageService'

describe('RamdaCookingBook Service', () => {
  it('renameKeys() should rename keys', () => {
    const items = [...map(renameKeys({ name: 'text', language: 'value' }))(languagesSortedByName)]
    expect(items[0].value).toEqual('bg')
    expect(items[0].text).toEqual('Bulgarian')
    expect(items[4].value).toEqual('en')
    expect(items[4].text).toEqual('English')
  })
})
