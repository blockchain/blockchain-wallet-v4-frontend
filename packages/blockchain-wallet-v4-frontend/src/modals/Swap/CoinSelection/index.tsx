import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'

import { Icon, Text } from 'blockchain-info-components'
import { StickyHeaderFlyoutWrapper } from 'components/Flyout'
import { CoinAccountListOption } from 'components/Form'
import { selectors } from 'data'
import { SUPPORTED_COINS } from 'data/coins/model/swap'
import { InitSwapFormValuesType, SwapSideType } from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'
import { SwapAccountType } from 'data/types'

import { Props as BaseProps, SuccessStateType } from '..'
import { TopText } from '../components'
import { getData } from './selectors'

class CoinSelection extends PureComponent<Props> {
  componentDidMount() {
    this.props.swapActions.fetchPairs()
    this.props.swapActions.fetchCustodialEligibility()
  }

  checkAccountSelected = (
    side: SwapSideType,
    values: InitSwapFormValuesType,
    account: SwapAccountType
  ) => {
    if (
      (side === 'BASE' && values?.BASE?.label === account.label) ||
      (side === 'COUNTER' && values?.COUNTER?.label === account.label)
    ) {
      return true
    }
    return false
  }

  checkBaseCustodial = (
    side: SwapSideType,
    values: InitSwapFormValuesType,
    account: SwapAccountType
  ) => {
    if (
      (side === 'COUNTER' && values?.BASE?.type === 'CUSTODIAL' && account.type === 'ACCOUNT') ||
      (side === 'BASE' && values?.COUNTER?.type === 'ACCOUNT' && account.type === 'CUSTODIAL')
    ) {
      return true
    }
    return false
  }

  checkCoinSelected = (
    side: SwapSideType,
    values: InitSwapFormValuesType,
    account: SwapAccountType
  ) => {
    if (
      (side === 'COUNTER' && values?.BASE?.coin === account.coin) ||
      (side === 'BASE' && values?.COUNTER?.coin === account.coin)
    ) {
      return true
    }
    return false
  }

  checkBaseAccountZero = (side: SwapSideType, account: SwapAccountType) => {
    if ((account.balance === 0 || account.balance === '0') && side === 'BASE') {
      return true
    }
    return false
  }

  checkCustodialEligibility = (custodialEligibility: boolean, account: SwapAccountType) => {
    return !(account.type === 'CUSTODIAL' && !custodialEligibility)
  }

  render() {
    // @ts-ignore
    const { coins, custodialEligibility, values, walletCurrency } = this.props
    return (
      <>
        <StickyHeaderFlyoutWrapper>
          <TopText spaceBetween={false} marginBottom>
            <Icon
              role='button'
              data-e2e='backToInitSwap'
              name='arrow-back'
              cursor
              size='24px'
              color='grey600'
              onClick={() =>
                this.props.swapActions.setStep({
                  step: 'INIT_SWAP'
                })
              }
            />{' '}
            <Text size='20px' color='grey900' weight={600} style={{ marginLeft: '24px' }}>
              {this.props.side === 'BASE' ? (
                <FormattedMessage id='copy.swap_from' defaultMessage='Swap from' />
              ) : (
                <FormattedMessage id='copy.receive_to' defaultMessage='Receive to' />
              )}
            </Text>
          </TopText>
          <Text size='16px' color='grey600' weight={500} style={{ margin: '10px 0 0 48px' }}>
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
        </StickyHeaderFlyoutWrapper>
        {SUPPORTED_COINS.map((coin) => {
          const accounts = (this.props.accounts[coin] as Array<SwapAccountType>) || []
          return accounts.map((account) => {
            const isAccountSelected = this.checkAccountSelected(this.props.side, values, account)
            const isCoinSelected = this.checkCoinSelected(this.props.side, values, account)
            const hideCustodialToAccount = this.checkBaseCustodial(this.props.side, values, account)

            const isBaseAccountZero = this.checkBaseAccountZero(this.props.side, account)
            const isCustodialEligible = this.checkCustodialEligibility(
              custodialEligibility,
              account
            )

            return (
              !isBaseAccountZero &&
              !isCoinSelected &&
              !hideCustodialToAccount &&
              isCustodialEligible && (
                <CoinAccountListOption
                  account={account}
                  coinModel={coins[account.coin]}
                  onClick={() => {
                    if (this.props.side === 'BASE') {
                      this.props.swapActions.changeBase(account)
                      return
                    }

                    if (this.props.side === 'COUNTER') {
                      this.props.swapActions.changeCounter(account)
                    }
                  }}
                  isAccountSelected={isAccountSelected}
                  isSwap
                  showLowFeeBadges
                  walletCurrency={walletCurrency}
                />
              )
            )
          })
        })}
      </>
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  custodialEligibility: selectors.components.swap.getCustodialEligibility(state).getOrElse(false),
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
