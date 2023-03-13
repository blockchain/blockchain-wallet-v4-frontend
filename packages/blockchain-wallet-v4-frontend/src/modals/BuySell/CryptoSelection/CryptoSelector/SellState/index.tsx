import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { any, map, values } from 'ramda'
import styled from 'styled-components'

import CoinAccountListOption from 'components/Form/CoinAccountListOption'
import { SwapAccountType } from 'data/types'

import SellEmptyState from '../SellEmptyState'
import { getData } from './selectors'

export const IconBackground = styled.div`
  margin-right: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  min-width: 32px;
  background-color: ${(props) => props.theme.blue000};
  border-radius: 40px;
`

export const FlexStartRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

class SellState extends React.Component<Props> {
  // Check to see if any accounts have balance
  checkBalances = () =>
    // @ts-ignore
    any((hasFunds) => hasFunds)(
      // @ts-ignore
      values(
        // @ts-ignore
        map(
          // @ts-ignore
          (coin) => any((acct) => acct.balance !== 0 && acct.balance !== '0')(coin),
          // @ts-ignore
          this.props.data.data.accounts
        )
      )
    )

  render() {
    const checkAccountsBalances = this.checkBalances()

    const { data, handleClose, handleSell } = this.props
    const {
      data: { coins, walletCurrency }
    } = data

    return checkAccountsBalances ? (
      coins &&
        coins.map((coin) => {
          const accounts = data?.data?.accounts[coin] as Array<SwapAccountType>
          return accounts.map(
            (account) =>
              account.balance !== '0' &&
              account.balance !== 0 && (
                <CoinAccountListOption
                  key={`${account.baseCoin}-${account.index}-${account.balance}-${account.coin}`}
                  account={account}
                  coin={account.coin}
                  isAccountSelected={false}
                  isSwap={false}
                  onClick={() => handleSell(account)}
                  showLowFeeBadges
                  walletCurrency={walletCurrency}
                />
              )
          )
        })
    ) : (
      <SellEmptyState handleClose={handleClose} />
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  handleClose: () => void
  handleSell: (account: SwapAccountType) => void
}

export default connector(SellState)
