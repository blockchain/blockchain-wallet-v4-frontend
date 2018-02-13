import { selectors } from 'data'
// import { lift } from 'ramda'

export const getData = state => {
  const authType = selectors.core.settings.getAuthType(state)
  const isMnemonicVerified = selectors.core.wallet.isMnemonicVerified(state)
  // const recoveryPhrase = state.securityCenter.mnemonic
  return {
    authType,
    isMnemonicVerified
    // recoveryPhrase
  }

  // const f = (a, v) => ({ authType: a, mnemonicVerified: v })

  // return lift(f)(authType, isMnemonicVerified)
}

// export const getData = state => selectors.core.wallet.isMnemonicVerified(state)
// const getMnemonic = s => selectors.core.wallet.getMnemonic(s, password)
// const eitherMnemonic = yield select(getMnemonic)
// if (eitherMnemonic.isRight) {
//   const mnemonic = eitherMnemonic.value.split(' ')
