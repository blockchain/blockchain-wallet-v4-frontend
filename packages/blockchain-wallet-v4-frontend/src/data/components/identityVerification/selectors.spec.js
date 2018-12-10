import { assocPath } from 'ramda'

import { getUserData, getUserTier } from 'data/modules/profile/selectors'
import { getSmsVerified } from 'blockchain-wallet-v4/src/redux/settings/selectors'

import { model } from 'data'
import { Remote } from 'blockchain-wallet-v4'
import { getSteps } from './selectors'

jest.mock('data/modules/profile/selectors')
jest.mock('blockchain-wallet-v4/src/redux/settings/selectors')

const { TIERS } = model.profile

const state = {
  components: {
    identityVerification: {
      isCoinify: false,
      desiredTier: 2
    }
  }
}

const setTier = assocPath(['components', 'identityVerification', 'desiredTier'])

describe('steps selector', () => {
  beforeEach(() => {
    getUserData.mockReturnValue(Remote.of({ mobileVerified: false }))
    getUserTier.mockReturnValue(Remote.of(TIERS[0]))
    getSmsVerified.mockReturnValue(Remote.of(false))
  })
  it('should select personal, mobile and verify steps for tier 0 - tier 2', () => {
    expect(getSteps(state)).toEqual(['personal', 'mobile', 'verify'])
  })

  it('should select personal step for tier 0 - tier 1', () => {
    expect(getSteps(setTier(TIERS[1], state))).toEqual(['personal'])
  })

  it('should select mobile and verify step for tier 1 - tier 2', () => {
    getUserTier.mockReturnValue(Remote.of(TIERS[1]))
    expect(getSteps(state)).toEqual(['mobile', 'verify'])
  })

  it('should select no steps for equal tiers', () => {
    expect(getSteps(setTier(TIERS[0], state))).toEqual([])
    getUserTier.mockReturnValue(Remote.of(TIERS[1]))
    expect(getSteps(setTier(TIERS[1], state))).toEqual([])
    getUserTier.mockReturnValue(Remote.of(TIERS[2]))
    expect(getSteps(state)).toEqual([])
  })

  it('should filter out mobile step if smsVerified is true', () => {
    getSmsVerified.mockReturnValue(Remote.of(true))
    expect(getSteps(state)).toEqual(['personal', 'verify'])
    getUserTier.mockReturnValueOnce(Remote.of(TIERS[1]))
    expect(getSteps(state)).toEqual(['verify'])
  })

  it('should filter out mobile step if mobileVerified is true', () => {
    getUserData.mockReturnValue(Remote.of({ mobileVerified: true }))
    expect(getSteps(state)).toEqual(['personal', 'verify'])
    getUserTier.mockReturnValueOnce(Remote.of(TIERS[1]))
    expect(getSteps(state)).toEqual(['verify'])
  })

  it('should add coinify step to tier 1 if isCoinify is true', () => {
    const coinifyState = assocPath(
      ['components', 'identityVerification', 'isCoinify'],
      true,
      state
    )
    expect(getSteps(coinifyState)).toEqual([
      'coinify',
      'personal',
      'mobile',
      'verify'
    ])
    expect(getSteps(setTier(TIERS[1], coinifyState))).toEqual([
      'coinify',
      'personal'
    ])

    getUserTier.mockReturnValueOnce(Remote.of(TIERS[1]))
    expect(getSteps(coinifyState)).toEqual(['mobile', 'verify'])

    getUserTier.mockReturnValue(Remote.of(TIERS[2]))
    expect(getSteps(state)).toEqual([])
  })
})
