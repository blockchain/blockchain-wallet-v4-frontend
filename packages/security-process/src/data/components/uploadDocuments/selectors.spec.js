import * as selectors from './selectors'
describe('upload document selectors', () => {
  it('getData should return the data', () => {
    const state = {
      components: { uploadDocuments: { data: '[45,457,78,65]' } }
    }
    expect(selectors.getData(state)).toEqual('[45,457,78,65]')
  })
  it('getReference should return reference', () => {
    const state = { components: { uploadDocuments: { reference: 'satoshi' } } }
    expect(selectors.getReference(state)).toEqual('satoshi')
  })
  it('getUploaded should return the uploaded file', () => {
    const state = { components: { uploadDocuments: { uploaded: 'nakamoto' } } }
    expect(selectors.getUploaded(state)).toEqual('nakamoto')
  })
})
