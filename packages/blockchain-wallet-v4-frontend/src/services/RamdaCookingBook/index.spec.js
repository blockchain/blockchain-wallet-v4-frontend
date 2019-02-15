import { map } from 'ramda'
import { renameKeys } from './index.js'
import { languagesSortedByName } from 'services/LanguageService'

describe('RamdaCookingBook Service', () => {
  it('renameKeys() should rename keys', () => {
    const items = [
      ...map(renameKeys({ name: 'text', language: 'value' }))(
        languagesSortedByName
      )
    ]
    expect(items[0].value).toEqual('zh')
    expect(items[0].text).toEqual('Chinese (simplified)')
    expect(items[2].value).toEqual('nl')
    expect(items[2].text).toEqual('Dutch')
  })
})
