
export const NotAsked = () => ({ status: 'NotAsked' })

export const Loading = () => ({ status: 'Loading' })

export const Failed = (error) => ({ status: 'Failed', value: error })

export const Success = (result) => ({ status: 'Success', value: result })

export const caseOf = (remoteData, cases) => (cases[remoteData.status] || cases._)(remoteData.value)

export const map = (f, remoteData) => caseOf(remoteData, {
  Success: (value) => Success(f(value)),
  _: () => remoteData
})

// map(x => x + 1, Failed('error')) -> Failed('error')
// map(x => x + 1, Success(1)) -> Success(2)

// let balancesMessage = caseOf(getRates(state), {
//   NotAsked: () => 'have not asked for balances',
//   Loading: () => 'balances are loading',
//   Success(): () => 
//   _: () => 'other state'
// })
