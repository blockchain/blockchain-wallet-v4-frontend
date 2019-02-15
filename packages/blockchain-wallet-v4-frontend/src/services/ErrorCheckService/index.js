import { match, isEmpty, head, is } from 'ramda'
import { utils } from 'blockchain-wallet-v4/src'

const checkForVulnerableAddressError = message => {
  if (!message || !is(String, message)) return
  const re = /A security issue effects address [13][a-km-zA-HJ-NP-Z0-9]{25,34}. Please Archive It and Contact support@blockchain.zendesk.com/
  const testForErrorMatch = match(re, message)
  const addressMatch =
    !isEmpty(testForErrorMatch) &&
    match(/[13][a-km-zA-HJ-NP-Z0-9]{26,33}/, message)
  const matchResult = !isEmpty(addressMatch) && head(addressMatch)
  return utils.bitcoin.isValidBitcoinAddress(matchResult) && matchResult
}

export { checkForVulnerableAddressError }
