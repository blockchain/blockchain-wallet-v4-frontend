import { useEffect } from 'react'
import { head, is, isEmpty, match } from 'ramda'

import { utils } from 'blockchain-wallet-v4/src'

const checkForVulnerableAddressError = message => {
  if (!message || !is(String, message)) return
  const re = /A security issue effects address [13][a-km-zA-HJ-NP-Z0-9]{25,34}. Please Archive It and Contact support@blockchain.zendesk.com/
  const testForErrorMatch = match(re, message)
  const addressMatch =
    !isEmpty(testForErrorMatch) &&
    match(/[13][a-km-zA-HJ-NP-Z0-9]{26,33}/, message)
  const matchResult = !isEmpty(addressMatch) && head(addressMatch)
  return utils.btc.isValidBtcAddress(matchResult) && matchResult
}

// https://usehooks.com/useOnClickOutside/
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = event => {
      // Do nothing if clicking ref's element or descendent elements or next sibling
      if (
        !ref.current ||
        ref.current.contains(event.target) ||
        ref.current.contains(event.target.nextElementSibling)
      ) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

export { checkForVulnerableAddressError, useOnClickOutside }
