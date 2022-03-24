import React from 'react'
import { IntlProvider } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { mount, shallow } from 'enzyme'

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

      expect(component.contains(<Icon name='arrowUp' size='sm' color='green600' />)).toBe(true)
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

      expect(component.contains(<Icon name='arrowDown' size='sm' color='red600' />)).toBe(true)
    })
  })
})
