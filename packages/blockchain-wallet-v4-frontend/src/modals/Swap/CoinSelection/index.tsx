import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import { equals } from 'ramda'

import { Text } from 'blockchain-info-components'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutHeader,
  FlyoutSubHeader
} from 'components/Flyout/Layout'
import CoinAccountListOption from 'components/Form/CoinAccountListOption'
import { selectors } from 'data'
import { InitSwapFormValuesType, SwapSideType } from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'
import { Analytics, SwapAccountType } from 'data/types'

import { Props as BaseProps, SuccessStateType } from '..'
import { getData } from './selectors'

class CoinSelection extends PureComponent<Props> {
  componentDidMount() {
    this.props.swapActions.fetchPairs()

    this.props.analyticsActions.trackEvent({
      key:
        this.props.side === 'BASE'
          ? Analytics.SWAP_FROM_WALLET_PAGE_VIEWED
          : Analytics.SWAP_RECEIVE_WALLET_PAGE_VIEWED,
      properties: {}
    })
  }

  checkAccountSelected = (
    side: SwapSideType,
    values: InitSwapFormValuesType,
    account: SwapAccountType
  ) => {
    if (
      (side === 'BASE' && !!values?.BASE && equals(values.BASE, account)) ||
      (side === 'COUNTER' && !!values?.COUNTER && equals(values?.COUNTER, account))
    ) {
      return true
    }
    return false
  }

  render() {
    const { filteredAccounts, values, walletCurrency } = this.props

    const Row = ({ data: rowData, index, style }) => {
      const account = rowData[index]

      const isAccountSelected = this.checkAccountSelected(this.props.side, values, account)

      return (
        <div style={style}>
          <CoinAccountListOption
            key={account.label + account.coin + account.type}
            account={account}
            coin={account.coin}
            onClick={() => {
              if (this.props.side === 'BASE') {
                this.props.swapActions.changeBase({ account })
                return
              }

              if (this.props.side === 'COUNTER') {
                this.props.swapActions.changeCounter({ account })
              }
            }}
            isAccountSelected={isAccountSelected}
            isSwap
            showLowFeeBadges
            walletCurrency={walletCurrency}
          />
        </div>
      )
    }

    return (
      <FlyoutContainer>
        <FlyoutHeader
          mode='back'
          data-e2e='backToInitSwap'
          onClick={() =>
            this.props.swapActions.setStep({
              step: 'INIT_SWAP'
            })
          }
        />
        <FlyoutSubHeader
          data-e2e='sendReceiveSubHeader'
          title={
            <Text size='24px' color='grey900' weight={600}>
              {this.props.side === 'BASE' ? (
                <FormattedMessage id='copy.swap_from' defaultMessage='Swap from' />
              ) : (
                <FormattedMessage id='copy.receive_to' defaultMessage='Receive to' />
              )}
            </Text>
          }
          subTitle={
            <Text size='16px' color='grey600' weight={500} style={{ margin: '10px 0 0' }}>
              {this.props.side === 'BASE' ? (
                <FormattedMessage
                  id='copy.swap_from_origin'
                  defaultMessage='Which wallet do you want to Swap from?'
                />
              ) : (
                <FormattedMessage
                  id='copy.swap_for_destination'
                  defaultMessage='Which crypto do you want to Swap for?'
                />
              )}
            </Text>
          }
        />
        <FlyoutContent mode='top'>
          <AutoSizer>
            {({ height, width }) => (
              <List
                className='List'
                height={height}
                itemData={filteredAccounts}
                itemCount={filteredAccounts?.length}
                itemSize={74}
                width={width}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </FlyoutContent>
      </FlyoutContainer>
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  coins: selectors.components.swap.getCoins(),
  values: selectors.form.getFormValues('initSwap')(state) as InitSwapFormValuesType,
  ...getData(state, ownProps)
})

const connector = connect(mapStateToProps)

export type OwnProps = BaseProps & {
  handleClose: () => void
  side: 'BASE' | 'COUNTER'
}
export type Props = OwnProps & SuccessStateType & ConnectedProps<typeof connector>

export default connector(CoinSelection)
