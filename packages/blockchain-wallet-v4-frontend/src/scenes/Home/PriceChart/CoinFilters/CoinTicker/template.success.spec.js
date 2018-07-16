import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { dissoc } from 'ramda'
import { testPropTypes } from 'utils/test.utils'
import TemplateSuccess from './template.success'

jest.mock('blockchain-info-components', () => ({ Link: 'link' }))

describe('CoinTicker template success', () => {
  const props = { coin: '10', fiat: '100', handleClick: jest.fn(), selected: false }

  it('renders correctly', () => {
    const component = shallow(<TemplateSuccess {...props} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('should accept a mandatory string for prop coin', () => {
    expect(testPropTypes(TemplateSuccess, 'coin', ['10'], false, dissoc('coin', props))).toBeTruthy()
    expect(testPropTypes(TemplateSuccess, 'coin', [0, '', undefined, null, {}], true, dissoc('coin', props))).toBeTruthy()
  })

  it('should accept a mandatory string for prop fiat', () => {
    expect(testPropTypes(TemplateSuccess, 'fiat', ['10'], false, dissoc('coin', props))).toBeTruthy()
    expect(testPropTypes(TemplateSuccess, 'fiat', [0, '', undefined, null, {}], true, dissoc('coin', props))).toBeTruthy()
  })

  it('should accept a mandatory function for prop handleClick', () => {
    expect(testPropTypes(TemplateSuccess, 'handleClick', [jest.fn()], false, dissoc('coin', props))).toBeTruthy()
    expect(testPropTypes(TemplateSuccess, 'handleClick', [0, '', undefined, null, {}], true, dissoc('coin', props))).toBeTruthy()
  })

  it('should accept a bool for prop selected', () => {
    expect(testPropTypes(TemplateSuccess, 'selected', [true, false], false, dissoc('coin', props))).toBeTruthy()
    expect(testPropTypes(TemplateSuccess, 'selected', [0, '', undefined, null, {}], true, dissoc('coin', props))).toBeTruthy()
  })
})
