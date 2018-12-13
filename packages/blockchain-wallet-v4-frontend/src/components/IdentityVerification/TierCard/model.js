import { path, prop } from 'ramda'

export const TIERS = {
  1: {
    time: '3',
    limit: 'ANNUAL',
    requirements: [
      {
        name: 'EMAIL',
        complete: prop('email')
      },
      {
        name: 'NAME',
        complete: userData =>
          prop('firstName', userData) && prop('lastName', userData)
      },
      {
        name: 'DOB',
        complete: prop('dob')
      },
      {
        name: 'ADDRESS',
        complete: userData =>
          path(['address', 'city'], userData) &&
          path(['address', 'country'], userData) &&
          path(['address', 'line1'], userData)
      }
    ]
  },
  2: {
    time: '10',
    limit: 'DAILY',
    requirements: [
      {
        name: 'TIER1',
        complete: (userData, tiersData) => tiersData[1].state === 'verified'
      },
      {
        name: 'MOBILE',
        complete: prop('mobileVerified')
      },
      {
        name: 'GOVID',
        complete: userData => prop('kycState', userData) !== 'NONE'
      },
      {
        name: 'SELFIE',
        complete: userData => prop('kycState', userData) !== 'NONE'
      }
    ]
  }
}
