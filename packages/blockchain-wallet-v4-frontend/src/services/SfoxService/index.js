import SFOX from 'bitcoin-sfox-client'

export const sfoxService = {
  refresh: (value, options, delegate) => {
    let sfox = new SFOX(value.data.value.sfox, delegate)
    sfox.api.apiKey = options.data.platforms.web.sfox.config.apiKey
    sfox.api.production = options.data.platforms.web.sfox.config.production
    return sfox
  }
}

export const isVerified = (verificationStatus) => {
  const { level } = verificationStatus
  return level === 'verified' || (level === 'pending' && verificationStatus.required_docs.length === 0)
}

const isActiveAccount = (accounts) => {
  return accounts[0] && accounts[0].status === 'active'
}

export const determineStep = (profile, verificationStatus, accounts) => {
  if (!profile) {
    return 'account'
  } else {
    if (!isVerified(verificationStatus)) {
      return 'verify'
    } else if (!accounts.length || !isActiveAccount(accounts)) {
      return 'funding'
    } else {
      return 'verified'
    }
  }
}

export const determineReason = (type, profile, verificationStatus, accounts) => {
  let reason
  if (!profile) reason = 'needs_account'
  else if (!isVerified(verificationStatus)) reason = 'needs_id'
  else if (!accounts.length) reason = 'needs_bank'
  else if (!isActiveAccount(accounts)) reason = 'needs_bank_active'
  else if (type === 'buy') reason = 'has_remaining_buy_limit'
  else if (type === 'sell') reason = 'has_remaining_sell_limit'
  else reason = 'unknown'

  return reason
}
