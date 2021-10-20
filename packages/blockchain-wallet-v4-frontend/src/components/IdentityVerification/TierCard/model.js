import { path, prop } from 'ramda'

export const TIERS = {
  1: {
    level: 'SILVER',
    limit: 'ANNUAL',
    requirements: [
      {
        complete: ({ emailVerified }) => emailVerified === 1,
        name: 'EMAIL'
      },
      {
        complete: ({ userData }) => prop('firstName', userData) && prop('lastName', userData),
        name: 'NAME'
      },
      {
        complete: ({ userData }) => prop('dob', userData),
        name: 'DOB'
      },
      {
        complete: ({ userData }) =>
          path(['address', 'city'], userData) &&
          path(['address', 'country'], userData) &&
          path(['address', 'line1'], userData),
        name: 'ADDRESS'
      }
    ],
    time: '3'
  },
  2: {
    level: 'GOLD',
    limit: 'DAILY',
    requirements: [
      {
        complete: ({ userTiers }) => userTiers[1].state === 'verified',
        name: 'TIER1'
      },
      {
        complete: ({ userData }) => prop('kycState', userData) !== 'NONE',
        name: 'GOVID'
      },
      {
        complete: ({ userData }) => prop('kycState', userData) !== 'NONE',
        name: 'SELFIE'
      }
    ],
    time: '10'
  }
}
