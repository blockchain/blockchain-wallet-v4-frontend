import React from 'react'
import { shallow } from 'enzyme'

import CoinBalanceDisplay from 'components/CoinWithBalance/CoinBalanceDisplay'
import CoinWithBalance from 'components/CoinWithBalance/CoinWithBalance'

describe('<CoinWithBalance />', () => {
  it('should display correctly and send correct balance value for FIAT', function () {
    const symbol = 'USD'
    const balance = '100'
    const wrapper = shallow(<CoinWithBalance symbol={symbol} value={balance} />)

    const coinWithBalanceProps = wrapper.find(CoinBalanceDisplay).getElement().props

    expect(wrapper).toMatchSnapshot()
    expect(coinWithBalanceProps.balance).toEqual(balance)
  })

  it('should display correctly and send correct balance value for Crypto', function () {
    const symbol = 'BTC'
    const balance = '1'
    const wrapper = shallow(<CoinWithBalance symbol={symbol} value={balance} />)

    const coinWithBalanceProps = wrapper.find(CoinBalanceDisplay).getElement().props

    expect(wrapper).toMatchSnapshot()
    const expectedBalance = `${balance}00000000`
    expect(coinWithBalanceProps.balance).toEqual(expectedBalance)
  })
})
