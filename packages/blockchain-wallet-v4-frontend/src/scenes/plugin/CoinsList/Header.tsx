import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route, Switch } from 'react-router-dom'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconMoreHorizontal } from '@blockchain-com/icons'
import { CombinedState } from 'redux'
import styled from 'styled-components'
import { actions } from 'data/cache/slice'

import { Text } from 'blockchain-info-components'
import { selectors } from 'data'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'

import Settings from '../Settings'
import { SwitchAccount } from '../SwitchAccount'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 40px;
`

const WalletWapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 3px 10px;
  background-color: ${colors.smoke800};
  border-radius: 8px;
  border: none;
  outline: none;
  cursor: pointer;
`

const Wallet = styled(Text)`
  color: ${(props) => props.theme.grey400};
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
`

const AssetWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.exchangeLogin};
`

const StatusLabel = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${colors.green500};
`

const SettingsButton = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
`

const Header = () => {
  const dispatch = useDispatch()
  const [isSwitchAccountVisible, setIsSwitchAccountVisible] = useState(false)
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)

  const selectedAccount = useSelector((state) => selectors.cache.getCache(state).selectedAccount)
  const coins = useSelector(selectors.components.swap.getCoins)
  const accounts = useSelector((state) =>
    getCoinAccounts(state as CombinedState<any>, { coins, ...SWAP_ACCOUNTS_SELECTOR })
  )
  const activeAccountCoin = selectedAccount && selectedAccount[0]?.baseCoin

  const switchAccounts = [accounts.ETH, accounts.BTC, accounts.BCH, accounts.XLM, accounts.STX]

  const setSwitchAccountVisibility = () => {
    setIsSwitchAccountVisible(true)
  }

  const setSettingsVisibility = () => {
    setIsSettingsVisible(true)
  }

  useEffect(() => {
    if (accounts.ETH && accounts.ETH[0] && !selectedAccount) {
      dispatch(actions.setSelectedAccount(accounts.ETH[0].address))
    }
  }, [accounts])

  return (
    <header>
      <HeaderWrapper>
        <WalletWapper onClick={setSwitchAccountVisibility}>
          <Wallet>
            <FormattedMessage
              id='scenes.plugin.coinslist.private_key_wallet'
              defaultMessage='Private Key Wallet'
            />
          </Wallet>
          <AssetWrapper>
            <Wallet>{activeAccountCoin}</Wallet>
            <StatusLabel />
          </AssetWrapper>
        </WalletWapper>
        <Link to='/plugin/coinslist' onClick={setSettingsVisibility}>
          <Icon label='IconMore' size='md'>
            <IconMoreHorizontal />
          </Icon>
        </Link>
      </HeaderWrapper>
      {isSwitchAccountVisible && (
        <SwitchAccount
          coins={coins}
          accounts={switchAccounts}
          setIsSwitchAccountVisible={setIsSwitchAccountVisible}
        />
      )}
      {isSettingsVisible && <Settings setIsSettingsVisible={setIsSettingsVisible} />}
    </header>
  )
}

export default Header
