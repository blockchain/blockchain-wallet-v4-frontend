import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { TierCard } from './index'
import { INITIAL_TIERS } from 'data/modules/profile/model.js'

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
})
