import { path, prop } from 'ramda'

export const TIERS = {
  1: {
    time: '3',
    level: 'SILVER',
    limit: 'ANNUAL',
    requirements: [
      {
        name: 'EMAIL',
        complete: ({ emailVerified }) => emailVerified === 1
      },
      {
        name: 'NAME',
        complete: ({ userData }) =>
          prop('firstName', userData) && prop('lastName', userData)
      },
      {
        name: 'DOB',
        complete: ({ userData }) => prop('dob', userData)
      },
      {
        name: 'ADDRESS',
        complete: ({ userData }) =>
          path(['address', 'city'], userData) &&
          path(['address', 'country'], userData) &&
          path(['address', 'line1'], userData)
      }
    ]
  },
  2: {
    time: '10',
    level: 'GOLD',
    limit: 'DAILY',
    requirements: [
      {
        name: 'TIER1',
        complete: ({ userTiers }) => userTiers[1].state === 'verified'
      },
      {
        name: 'GOVID',
        complete: ({ userData }) => prop('kycState', userData) !== 'NONE'
      },
      {
        name: 'SELFIE',
        complete: ({ userData }) => prop('kycState', userData) !== 'NONE'
      }
    ]
  }
}
