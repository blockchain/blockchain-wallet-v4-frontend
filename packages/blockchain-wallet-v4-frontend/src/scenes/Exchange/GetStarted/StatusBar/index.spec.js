import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { Status } from './index'

jest.mock('./Statuses/GetStarted', () => 'GetStarted')
jest.mock('./Statuses/InProgress', () => 'InProgress')
jest.mock('./Statuses/Pending', () => 'Pending')
jest.mock('./Statuses/Rejected', () => 'Rejected')
jest.mock('./Statuses/UnderReview', () => 'UnderReview')

describe('Status', () => {
  it('renders correctly when step is getstarted', () => {
    const component = shallow(<Status step='getstarted' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when step is inprogress', () => {
    const component = shallow(<Status step='getstarted' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when step is pending', () => {
    const component = shallow(<Status step='pending' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when step is underreview', () => {
    const component = shallow(<Status step='underreview' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when step is rejected', () => {
    const component = shallow(<Status step='rejected' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
