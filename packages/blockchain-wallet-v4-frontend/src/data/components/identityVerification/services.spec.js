import { assocPath } from 'ramda'

import { model } from 'data'
import { computeSteps } from './services'

const { TIERS } = model.profile

const options = {
  tiers: {
    selected: 2,
    next: 1
  },
  mobileVerified: false,
  smsVerified: false,
  currentStep: 'personal',
  isCoinify: false,
  needMoreInfo: false
}

const setSelectedTier = assocPath(['tiers', 'selected'])
const setNextTier = assocPath(['tiers', 'next'])

describe('steps selector', () => {
  it('should select personal, mobile and verify steps for next 1 and selected 2', () => {
    expect(computeSteps(options)).toEqual(['personal', 'mobile', 'verify'])
  })

  it('should select personal step for next 1 and selected 1', () => {
    expect(computeSteps(setSelectedTier(TIERS[1], options))).toEqual([
      'personal'
    ])
  })

  it('should select mobile and verify step for next 2 and selected 2', () => {
    expect(computeSteps(setNextTier(TIERS[2], options))).toEqual([
      'mobile',
      'verify'
    ])
  })

  it('should filter out mobile step if smsVerified is true', () => {
    const smsVerifiedOptions = { ...options, smsVerified: true }
    expect(computeSteps(smsVerifiedOptions)).toEqual(['personal', 'verify'])
    expect(computeSteps(setNextTier(TIERS[2], smsVerifiedOptions))).toEqual([
      'verify'
    ])
  })

  it('should filter out mobile step if mobileVerified is true', () => {
    const mobileVerifiedState = { ...options, mobileVerified: true }
    expect(computeSteps(mobileVerifiedState)).toEqual(['personal', 'verify'])
    expect(computeSteps(setNextTier(TIERS[2], mobileVerifiedState))).toEqual([
      'verify'
    ])
  })

  it('should add coinify step if isCoinify is true', () => {
    const coinifyOptions = { ...options, isCoinify: true }
    expect(computeSteps(coinifyOptions)).toEqual([
      'coinify',
      'personal',
      'mobile',
      'verify'
    ])
    expect(computeSteps(setSelectedTier(TIERS[1], coinifyOptions))).toEqual([
      'coinify',
      'personal'
    ])
    expect(computeSteps(setNextTier(TIERS[2], coinifyOptions))).toEqual([
      'coinify',
      'mobile',
      'verify'
    ])
  })

  it('should add more info step before tier 2 if needMoreInfo is true', () => {
    const morInfoOptions = { ...options, needMoreInfo: true }
    expect(computeSteps(morInfoOptions)).toEqual([
      'personal',
      'mobile',
      'verify'
    ])
    expect(computeSteps(setSelectedTier(TIERS[1], morInfoOptions))).toEqual([
      'personal'
    ])
    expect(computeSteps(setNextTier(TIERS[2], morInfoOptions))).toEqual([
      'moreInfo',
      'mobile',
      'verify'
    ])
  })
})
