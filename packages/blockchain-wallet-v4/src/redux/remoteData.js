import { equals, prop } from 'ramda'

export const NotAsked = () => ({ status: 'NotAsked' })

export const Loading = () => ({ status: 'Loading' })

export const Failed = (error) => ({ status: 'Failed', value: error })

export const Success = (result) => ({ status: 'Success', value: result })

export const caseOf = (remoteData, cases) => (cases[remoteData.status] || cases._)(remoteData.value)

export const map = (f, remoteData) => caseOf(remoteData, {
  Success: (value) => Success(f(value)),
  _: () => remoteData
})

export const concat = (remoteData1, remoteData2) => {
  const status1 = prop('status', remoteData1)
  const value1 = prop('value', remoteData1)
  const status2 = prop('status', remoteData2)
  const value2 = prop('value', remoteData2)
  if (equals(status1, 'Success') && equals(status2, 'Success')) return { status: 'Success', value: [value1, value2] }
  if (equals(status1, 'Failed') && equals(status2, 'Failed')) return { status: 'Failed', value: [value1, value2] }
  if (equals(status1, 'NotAsked') || equals(status2, 'NotAsked')) return { status: 'NotAsked' }
  if (equals(status1, 'Failed')) return { status: 'Failed', value: [value1] }
  if (equals(status2, 'Failed')) return { status: 'Failed', value: [value2] }
  if (equals(status1, 'Loading') || equals(status2, 'Loading')) return { status: 'Loading' }
  return { status: 'NotAsked' }
}
