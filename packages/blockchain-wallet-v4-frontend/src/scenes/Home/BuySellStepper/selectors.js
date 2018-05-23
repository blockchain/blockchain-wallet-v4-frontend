import { lift } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

import { selectors } from 'data'

export const getData = (state) => {
  const profile = selectors.core.data.sfox.getProfile(state)
  const accounts = selectors.core.data.sfox.getAccounts(state)
  const verificationStatus = selectors.core.data.sfox.getVerificationStatus(state).data
  return lift((profile, accounts) => ({ profile, accounts, verificationStatus }))(profile, accounts)
}


//
// export const getData = (state) => {
//   const partnerR = selectors.exchange.getCanTrade(state)
//
//   //return lift((profile, accounts) => ({ profile, accounts, verificationStatus }))(profile, accounts)
//
//   // console.info(partner)
//   // console.info(profile)
//   // console.info(accounts)
//
//   const transform = partner => {
//     const accounts = Remote.of(selectors.core.data.sfox.getAccounts(state)).getOrElse([])
//     const profile = Remote.of(selectors.core.data.sfox.getProfile(state)).getOrElse({ account: { verification_status: {} }, limits: { buy: 0, sell: 0 } })
//     const verificationStatus = Remote.of(selectors.core.data.sfox.getVerificationStatus(state)).getOrElse({ level: 'unverified', required_docs: [] })
//
//     return {
//       partner: partner,
//       totalSteps: partner === 'sfox' ? 4 : 2,
//       profile: profile,
//       accounts: accounts,
//       verificationStatus: verificationStatus
//     }
//   }
//
//   return partnerR.map(transform)
//
//   //return {} //lift((profile, accounts) => ({ profile, accounts, verificationStatus }))(profile, accounts)
// }

// export const getData = state => {
//   const paymentR = selectors.components.sendBch.getPayment(state)
//
//   const transform = payment => {
//     const fromLabel = bchFromLabel(payment, state)
//     const toLabel = bchToLabel(payment, state)
//
//     return {
//       message: payment.description,
//       fromAddress: fromLabel,
//       toAddress: toLabel,
//       amount: payment.amount[0],
//       fee: payment.selection.fee,
//       total: payment.selection.fee + payment.amount[0]
//     }
//   }

//   return paymentR.map(transform)
// }


// export const getData = state => {
//   const toToggled = selectors.components.sendBch.getToToggled(state)
//   const paymentR = selectors.components.sendBch.getPayment(state)
//   const bchAccountsLength = length(selectors.core.kvStore.bch.getAccounts(state).getOrElse([]))
//   const enableToggle = bchAccountsLength > 1
//
//   const transform = payment => {
//     const minFeePerByte = path(['fees', 'limit', 'min'], payment)
//     const maxFeePerByte = path(['fees', 'limit', 'max'], payment)
//     const totalFee = path(['selection', 'fee'], payment)
//     const effectiveBalance = prop('effectiveBalance', payment)
//     const destination = formValueSelector('sendBch')(state, 'to')
//     const from = formValueSelector('sendBch')(state, 'from')
//
//     return {
//       from,
//       toToggled,
//       enableToggle,
//       effectiveBalance,
//       minFeePerByte,
//       maxFeePerByte,
//       destination,
//       totalFee
//     }
//   }
//
//   return paymentR.map(transform)
// }
