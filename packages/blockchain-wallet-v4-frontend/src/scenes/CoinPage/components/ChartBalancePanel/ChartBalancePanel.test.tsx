import React from 'react'
import { IntlProvider } from 'react-intl'
import { mount, shallow } from 'enzyme'

import { Icon } from 'blockchain-info-components'

import { ChartBalancePanel } from '.'

describe('ChartBalancePanel', () => {
  describe('When balance is positive', () => {
    it('Should see the positive balance', () => {
      const component = mount(
        <IntlProvider locale='en'>
          <ChartBalancePanel
            coinCode='BTC'
            pastHourChange='34.69'
            isPositive
            pastHourPrice='$9.95'
            price='$30.000'
          />
        </IntlProvider>
      )

      expect(component.contains('$9.95')).toBe(true)
      expect(component.contains('$30.000')).toBe(true)
      expect(component.contains('(34.69%)')).toBe(true)
      expect(component.contains('BTC Price')).toBe(true)
      expect(component.contains('Past Hour')).toBe(true)
    })

    it('Should display the green arrow up', () => {
      const component = shallow(
        <ChartBalancePanel
          coinCode='BTC'
          pastHourChange='34.69'
          isPositive
          pastHourPrice='$9.95'
          price='$30.000'
        />
      )

      expect(component.contains(<Icon name='arrow-up' size='22px' color='green600' />)).toBe(true)
    })
  })

  describe('When balance is negative', () => {
    it('Should display the red arrow down', () => {
      const component = shallow(
        <ChartBalancePanel
          coinCode='BTC'
          pastHourChange='34.69'
          isPositive={false}
          pastHourPrice='$9.95'
          price='$30.000'
        />
      )

      expect(component.contains(<Icon name='arrow-down' size='22px' color='red600' />)).toBe(true)
    })
  })
})
