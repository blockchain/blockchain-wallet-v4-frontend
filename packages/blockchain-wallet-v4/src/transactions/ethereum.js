// import { contains } from 'ramda'

// const getType = (tx, accounts) => {
//   switch (true) {
//     case accounts: return 'Transferred'
//     case result < 0: return 'Sent'
//     case result > 0: return 'Received'
//     default: return 'Unknown'
//   }
// }

// // amount is what we show on the transaction feed
// // result is internalreceive - internalspend
// const computeAmount = (type, inputData, outputData) => {
//   switch (type) {
//     case 'Transferred': return propOr(0, 'internal', outputData) - propOr(0, 'change', outputData)
//     case 'Sent': return -propOr(0, 'internal', outputData) + propOr(0, 'internal', inputData)
//     case 'Received': return propOr(0, 'internal', outputData) - propOr(0, 'internal', inputData)
//     default: return propOr(0, 'internal', outputData) - propOr(0, 'internal', inputData)
//   }
// }


// export const transformEthereumTx = (tx, accounts) => {
//   const type = getType(tx, accounts)

//   return {
//     type,
//     amount,
//     to,
//     from,
//     description,
//     status
//   }
// }
