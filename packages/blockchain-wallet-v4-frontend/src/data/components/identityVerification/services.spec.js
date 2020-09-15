import { assocPath } from 'ramda'
import { computeSteps } from './services'
import { model } from 'data'

const { TIERS } = model.profile

const options = {
  tiers: {
    selected: 2,
    next: 1
  },
  mobileVerified: false,
  smsVerified: false,
  currentStep: 'personal',
  needMoreInfo: false
}

const setSelectedTier = assocPath(['tiers', 'selected'])
const setNextTier = assocPath(['tiers', 'next'])

describe('steps selector', () => {
  it('should select personal, mobile, verify, and submitted steps for next 1 and selected 2', () => {
    expect(computeSteps(options)).toEqual([
      'personal',
      'mobile',
      'verify',
      'submitted'
    ])
  })

  it('should select personal step for next 1 and selected 1', () => {
    expect(computeSteps(setSelectedTier(TIERS[1], options))).toEqual([
      'personal'
    ])
  })

  it('should select mobile and verify step for next 2 and selected 2', () => {
    expect(computeSteps(setNextTier(TIERS[2], options))).toEqual([
      'mobile',
      'verify',
      'submitted'
    ])
  })

  it('should filter out mobile step if smsVerified is true', () => {
    const smsVerifiedOptions = { ...options, smsVerified: true }
    expect(computeSteps(smsVerifiedOptions)).toEqual([
      'personal',
      'verify',
      'submitted'
    ])
    expect(computeSteps(setNextTier(TIERS[2], smsVerifiedOptions))).toEqual([
      'verify',
      'submitted'
    ])
  })

  it('should filter out mobile step if mobileVerified is true', () => {
    const mobileVerifiedState = { ...options, mobileVerified: true }
    expect(computeSteps(mobileVerifiedState)).toEqual([
      'personal',
      'verify',
      'submitted'
    ])
    expect(computeSteps(setNextTier(TIERS[2], mobileVerifiedState))).toEqual([
      'verify',
      'submitted'
    ])
  })

  it('should add more info step before tier 2 if needMoreInfo is true', () => {
    const moreInfoOptions = { ...options, needMoreInfo: true }
    expect(computeSteps(moreInfoOptions)).toEqual([
      'personal',
      'mobile',
      'verify',
      'submitted'
    ])
    expect(computeSteps(setSelectedTier(TIERS[1], moreInfoOptions))).toEqual([
      'personal'
    ])
    expect(computeSteps(setNextTier(TIERS[2], moreInfoOptions))).toEqual([
      'moreInfo',
      'mobile',
      'verify',
      'submitted'
    ])
  })
})
