import { assocPath } from 'ramda'

import { model } from 'data'

import computeSteps from './services'

const { TIERS } = model.profile

const options = {
  currentStep: 'infoAndResidential',
  mobileVerified: false,
  needMoreInfo: false,
  smsVerified: false,
  tiers: {
    next: 1,
    selected: 2
  }
}

const setSelectedTier = assocPath(['tiers', 'selected'])
const setNextTier = assocPath(['tiers', 'next'])

describe('steps selector', () => {
  it('should select personal, mobile, verify, and submitted steps for next 1 and selected 2', () => {
    expect(computeSteps(options)).toEqual([
      'infoAndResidential',
      'additionalInfo',
      'verify',
      'submitted'
    ])
  })

  it('should select infoAndResidential step for next 1 and selected 1', () => {
    expect(computeSteps(setSelectedTier(TIERS[1], options))).toEqual(['infoAndResidential'])
  })

  it('should select mobile and verify step for next 2 and selected 2', () => {
    expect(computeSteps(setNextTier(TIERS[2], options))).toEqual([
      'additionalInfo',
      'verify',
      'submitted'
    ])
  })

  it('should add more info step before tier 2 if needMoreInfo is true', () => {
    const moreInfoOptions = { ...options, needMoreInfo: true }
    expect(computeSteps(moreInfoOptions)).toEqual([
      'infoAndResidential',
      'additionalInfo',
      'verify',
      'submitted'
    ])
    expect(computeSteps(setSelectedTier(TIERS[1], moreInfoOptions))).toEqual(['infoAndResidential'])
    expect(computeSteps(setNextTier(TIERS[2], moreInfoOptions))).toEqual([
      'moreInfo',
      'additionalInfo',
      'verify',
      'submitted'
    ])
  })
})
