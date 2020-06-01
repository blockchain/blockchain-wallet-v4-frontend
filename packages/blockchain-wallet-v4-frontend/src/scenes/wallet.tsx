import { has, map, values } from 'ramda'
import { Switch } from 'react-router-dom'
import React from 'react'

import Addresses from './Settings/Addresses'
import Airdrops from './Airdrops'
import Borrow from './Borrow'
import Exchange from './Exchange'
import ExchangeHistory from './ExchangeHistory'
import ExchangeProfile from './ExchangeProfile'
import General from './Settings/General'
import Home from './Home'
import Interest from './Interest'
import Lockbox from './Lockbox'
import Preferences from './Settings/Preferences'
import Profile from './Settings/Profile'
import SecurityCenter from './SecurityCenter'
import TheExchange from './TheExchange'
import Transactions from './Transactions'
import WalletLayout from 'layouts/Wallet'

type Props = {
  supportedCoins
}

const WalletSwitch: React.FC<Props> = props => {
  return (
    <Switch>
      <WalletLayout path='/airdrops' component={Airdrops} />
      <WalletLayout path='/borrow' component={Borrow} />
      <WalletLayout path='/exchange' component={TheExchange} />
      <WalletLayout path='/home' component={Home} />
      <WalletLayout path='/interest' component={Interest} />
      <WalletLayout path='/lockbox' component={Lockbox} />
      <WalletLayout path='/security-center' component={SecurityCenter} />
      <WalletLayout path='/settings/addresses' component={Addresses} />
      <WalletLayout path='/settings/general' component={General} />
      <WalletLayout path='/settings/preferences' component={Preferences} />
      <WalletLayout path='/settings/profile' component={Profile} />
      <WalletLayout path='/swap' component={Exchange} exact />
      <WalletLayout path='/swap/history' component={ExchangeHistory} />
      <WalletLayout path='/swap/profile' component={ExchangeProfile} />
      {values(
        map(
          coin =>
            coin.txListAppRoute &&
            coin.invited && (
              <WalletLayout
                path={coin.txListAppRoute}
                component={Transactions}
                coin={coin.coinCode}
                isCoinErc20={has('contractAddress', coin)}
                key={coin.coinCode}
              />
            ),
          props.supportedCoins
        )
      )}
    </Switch>
  )
}

export default WalletSwitch
