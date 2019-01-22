import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { assocPath } from 'ramda'

import { TierCard } from './index'
import { INITIAL_TIERS, TIERS_STATES } from 'data/modules/profile/model.js'

const userTiers = INITIAL_TIERS

describe('TierCard', () => {
  it('renders null w/o showBanner', () => {
    const component = shallow(<TierCard tier={1} userTiers={userTiers} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with column view', () => {
    const component = shallow(
      <TierCard tier={2} userTiers={userTiers} column />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should render continue button if tier has started', () => {
    const verifyIdentity = jest.fn()
    const component = shallow(
      <TierCard
        tier={1}
        userTiers={userTiers}
        userData={{ tiers: { selected: 1 } }}
        verifyIdentity={verifyIdentity}
      />
    )
    const button = component.find('TierCard__ActionButton')
    expect(button).toHaveLength(1)
    expect(button.children().prop('defaultMessage')).toBe('Continue')
    button.simulate('click')
    expect(verifyIdentity).toHaveBeenCalledTimes(1)
  })

  it('should render get started button if tier has not started', () => {
    const verifyIdentity = jest.fn()
    const component = shallow(
      <TierCard
        tier={1}
        userTiers={userTiers}
        userData={{ tiers: { selected: 0 } }}
        verifyIdentity={verifyIdentity}
      />
    )
    const button = component.find('TierCard__ActionButton')
    expect(button).toHaveLength(1)
    expect(button.children().prop('defaultMessage')).toBe('Get Started')
    button.simulate('click')
    expect(verifyIdentity).toHaveBeenCalledTimes(1)
  })

  it('should render swap now button if tier is verified', () => {
    const tiers = assocPath([1, 'state'], TIERS_STATES.VERIFIED, userTiers)
    const goToSwap = jest.fn()
    const component = shallow(
      <TierCard tier={1} userTiers={tiers} goToSwap={goToSwap} />
    )
    const button = component.find('TierCard__ActionButton')
    expect(button).toHaveLength(1)
    expect(button.children().prop('defaultMessage')).toBe('Swap Now')
    button.simulate('click')
    expect(goToSwap).toHaveBeenCalledTimes(1)
  })

  it('should no button if tier state is neither none nor verified', () => {
    const tiers = assocPath([1, 'state'], TIERS_STATES.PENDING, userTiers)
    const component = shallow(<TierCard tier={1} userTiers={tiers} />)
    expect(component.find('TierCard__ActionButton')).toHaveLength(0)
  })
})
