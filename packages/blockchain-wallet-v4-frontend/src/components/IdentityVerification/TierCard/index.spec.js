import { assocPath } from 'ramda'
import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import { INITIAL_TIERS, TIERS_STATES } from 'data/modules/profile/model.js'
import { TierCard } from './index'

const userTiers = INITIAL_TIERS

describe('TierCard', () => {
  it('renders null w/o showBanner', () => {
    const component = shallow(
      <TierCard
        tier={1}
        userTiers={userTiers}
        userData={{ tiers: { selected: 1 } }}
      />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with column view', () => {
    const component = shallow(
      <TierCard
        tier={2}
        userTiers={userTiers}
        userData={{ tiers: { selected: 1 } }}
        column
      />
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
    const button = component.find('.actionButton')
    expect(button).toHaveLength(1)
    expect(button.children().prop('defaultMessage')).toBe('Continue')
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
    const button = component.find('.actionButton')
    expect(button).toHaveLength(1)
    expect(
      button
        .children()
        .children()
        .prop('defaultMessage')
    ).toBe('Unlock Silver')
  })

  it('should render swap now button if tier is verified', () => {
    const tiers = assocPath([1, 'state'], TIERS_STATES.VERIFIED, userTiers)
    const goToSwap = jest.fn()
    const component = shallow(
      <TierCard
        tier={1}
        userData={{ tiers: { selected: 1 } }}
        userTiers={tiers}
        goToSwap={goToSwap}
      />
    )
    const button = component.find('.actionButton')
    expect(button).toHaveLength(1)
    expect(button.children().prop('defaultMessage')).toBe('Buy Crypto Now')
    button.simulate('click')
    expect(goToSwap).toHaveBeenCalledTimes(1)
  })

  it('should no button if tier state is neither none nor verified', () => {
    const tiers = assocPath([1, 'state'], TIERS_STATES.PENDING, userTiers)
    const component = shallow(
      <TierCard
        userData={{ tiers: { selected: 1 } }}
        tier={1}
        userTiers={tiers}
      />
    )
    expect(component.find('.actionButton')).toHaveLength(0)
  })
})
