import { getHostnameFromHref } from '.'

describe('#getHostnameFromHref()', () => {
  it('Should return the host name from href', () => {
    expect(getHostnameFromHref('https://blockchain.com')).toEqual('blockchain.com')
  })

  it('Should return the host name from href with no sub domain', () => {
    expect(getHostnameFromHref('https://stating.blockchain.com')).toEqual('blockchain.com')
  })
})
