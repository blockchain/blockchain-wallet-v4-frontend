import React from 'react'
import { IntlProvider } from 'react-intl'
import { render } from 'enzyme'

import { HoldingsCard } from '.'

describe('HoldingsCard', () => {
  describe('BTC', () => {
    const createBtcScene = () =>
      render(
        <IntlProvider locale='en'>
          <HoldingsCard
            coinCode='BTC'
            total='$7,926.43'
            coinTotal='0.00039387'
            actions={[<span key={1}>buy</span>, <span key={2}>receive</span>]}
          />
        </IntlProvider>
      )

    it('Should display the title', () => {
      const wrapper = createBtcScene()

      expect(wrapper.text()).toContain('Your Total BTC')
    })

    it('Should display the total amount', () => {
      const wrapper = createBtcScene()

      expect(wrapper.text()).toContain('$7,926.43')
    })

    it('Should display the total amoint in the coin value', () => {
      const wrapper = createBtcScene()

      expect(wrapper.text()).toContain('0.00039387')
    })

    it('Should display the actions', () => {
      const wrapper = createBtcScene()

      expect(wrapper.text()).toContain('buy')
      expect(wrapper.text()).toContain('receive')
    })
  })
})
