import configureLocales from './index.js'

describe('LocalesService', () => {
  it('should configure all locales in the store', () => {
    let mockStore = configureLocales({})
    expect(mockStore.messages.bg).toBeDefined()
    expect(mockStore.messages.da).toBeDefined()
    expect(mockStore.messages.de).toBeDefined()
    expect(mockStore.messages.el).toBeDefined()
    expect(mockStore.messages.en).toBeDefined()
    expect(mockStore.messages.fr).toBeDefined()
    expect(mockStore.messages.hi).toBeDefined()
    expect(mockStore.messages.hu).toBeDefined()
    expect(mockStore.messages.id).toBeDefined()
    expect(mockStore.messages.it).toBeDefined()
    expect(mockStore.messages.ja).toBeDefined()
    expect(mockStore.messages.ko).toBeDefined()
    expect(mockStore.messages.nl).toBeDefined()
    expect(mockStore.messages.nn).toBeDefined()
    expect(mockStore.messages.pl).toBeDefined()
    expect(mockStore.messages.pt).toBeDefined()
    expect(mockStore.messages.zh).toBeDefined()
  })
})
