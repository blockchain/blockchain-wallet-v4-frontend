import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { assoc } from 'ramda'
import { ChartContainer } from './index'
import { Remote } from 'blockchain-wallet-v4/src'
jest.mock('./template.success', () => 'template.na.js.success')
jest.mock('./template.error', () => 'template.na.js.error')
jest.mock('./template.loading', () => 'template.na.js.loading')
jest.mock('data', () => ({}))
jest.mock('./selectors', () => jest.fn())

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
}

global.localStorage = localStorageMock

describe('Chart container', () => {
  const props = {
    data: Remote.Success(''),
    priceChartActions: { initialized: jest.fn() }
  }

  it('renders correctly (Success)', () => {
    const component = shallow(<ChartContainer {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly (Failure)', () => {
    const component = shallow(
      <ChartContainer {...assoc('data', Remote.Failure(''), props)} />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly (Loading)', () => {
    const component = shallow(
      <ChartContainer {...assoc('data', Remote.Loading, props)} />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly (NotAsked)', () => {
    const component = shallow(
      <ChartContainer {...assoc('data', Remote.NotAsked, props)} />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
