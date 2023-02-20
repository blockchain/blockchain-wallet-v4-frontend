import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { formatCoin } from '@core/exchange/utils'
import { CrossBorderLimitsPayload, ExtractSuccess, WalletAccountEnum } from '@core/types'
import { CoinAccountIcon, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  Analytics,
  InitSwapFormValuesType,
  SwapAccountType,
  SwapBaseCounterTypes,
  SwapCoinType
} from 'data/types'

import { Props as BaseProps, SuccessStateType as SuccessType } from '..'
import { BalanceRow, Border, Option, OptionTitle, OptionValue, TopText } from '../components'
import { checkAccountZeroBalance } from '../model'
import Checkout from './Checkout'
import { ResultAmount } from './ResultAmount'
import getData from './selectors'
import Failure from './template.failure'
import Loading from './template.loading'
import Upgrade from './template.upgrade'

const SubTopText = styled.div`
  display: flex;
  align-items: center;
`
const Options = styled.div`
  position: relative;
`
const Toggler = styled.div`
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.grey000};
  background: ${(props) => props.theme.white};
  right: 33px;
  display: flex;
  cursor: pointer;
  padding: 6px 0px;
  span {
    position: relative;
  }
  span:first-child {
    width: 18px;
    top: -2px;
  }
  span:last-child {
    top: 2px;
  }
`

class EnterAmount extends PureComponent<Props> {
  componentDidMount() {
    this.props.swapActions.initAmountForm()

    if (this.props?.initSwapFormValues?.BASE && this.props?.initSwapFormValues?.COUNTER) {
      const { BASE, COUNTER } = this.props.initSwapFormValues

      // fetch crossborder limits
      const fromAccount =
        BASE.type === SwapBaseCounterTypes.CUSTODIAL
          ? WalletAccountEnum.CUSTODIAL
          : WalletAccountEnum.NON_CUSTODIAL
      const toAccount =
        COUNTER.type === SwapBaseCounterTypes.CUSTODIAL
          ? WalletAccountEnum.CUSTODIAL
          : WalletAccountEnum.NON_CUSTODIAL
      const inputCurrency = BASE.coin
      const outputCurrency = COUNTER.coin
      this.props.swapActions.fetchCrossBorderLimits({
        fromAccount,
        inputCurrency,
        outputCurrency,
        toAccount
      } as CrossBorderLimitsPayload)
    }
  }

  handleBaseCoinSelection = (accounts: { [key in SwapCoinType]: Array<SwapAccountType> }) => {
    const isAccountZeroBalance = checkAccountZeroBalance(accounts)

    if (isAccountZeroBalance) {
      this.props.swapActions.setStep({
        step: 'NO_HOLDINGS'
      })
    } else {
      this.props.swapActions.setStep({
        options: {
          side: 'BASE'
        },
        step: 'COIN_SELECTION'
      })
    }

    this.props.analyticsActions.trackEvent({
      key: Analytics.SWAP_FROM_WALLET_PAGE_CLICKED,
      properties: {}
    })
  }

  handleCounterCoinSelection = () => {
    this.props.swapActions.setStep({
      options: {
        side: 'COUNTER'
      },
      step: 'COIN_SELECTION'
    })

    this.props.analyticsActions.trackEvent({
      key: Analytics.SWAP_RECEIVE_WALLET_PAGE_CLICKED,
      properties: {}
    })
  }

  handleGoBackClick = () => {
    this.props.swapActions.returnToInitSwap()

    this.props.analyticsActions.trackEvent({
      key: Analytics.SWAP_AMOUNT_SCREEN_BACK_CLICKED,
      properties: {}
    })
  }

  render() {
    if (!this.props.initSwapFormValues?.BASE || !this.props.initSwapFormValues?.COUNTER) {
      this.props.swapActions.setStep({ step: 'INIT_SWAP' })

      return null
    }

    const { BASE, COUNTER } = this.props.initSwapFormValues
    const { userData } = this.props

    const { coinfig: baseCoinfig } = window.coins[BASE.coin]
    const { coinfig: counterCoinfig } = window.coins[COUNTER.coin]

    const showSilverRevampBanner = this.props.products?.swap?.maxOrdersLeft > 0

    return (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween>
            <SubTopText>
              <Icon
                role='button'
                name='arrow-back'
                cursor
                size='24px'
                color='grey600'
                onClick={this.handleGoBackClick}
              />{' '}
              <Text size='20px' color='grey900' weight={600} style={{ marginLeft: '16px' }}>
                <FormattedMessage id='copy.new_swap' defaultMessage='New Swap' />
              </Text>
            </SubTopText>
            {this.props.quotePriceR.cata({
              Failure: () => <></>,
              Loading: () => <SpinningLoader borderWidth='4px' height='14px' width='14px' />,
              NotAsked: () => <SpinningLoader borderWidth='4px' height='14px' width='14px' />,
              Success: (val) => (
                <Text size='14px' color='grey900' weight={500}>
                  1 {baseCoinfig.displaySymbol} = {formatCoin(val.data.price)}{' '}
                  {counterCoinfig.displaySymbol}
                </Text>
              )
            })}
          </TopText>
        </FlyoutWrapper>
        <div>
          {this.props.data.cata({
            Failure: (e) => <Failure {...this.props} error={e} />,
            Loading: () => <Loading />,
            NotAsked: () => <Loading />,
            Success: (val) => (
              <>
                <Options>
                  <Option
                    role='button'
                    data-e2e='selectFromAcct'
                    onClick={() => this.handleBaseCoinSelection(val.accounts)}
                  >
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        <FormattedMessage id='copy.swap' defaultMessage='Swap' />
                      </Text>
                      <OptionTitle>{BASE.label}</OptionTitle>
                      <OptionValue>
                        <BalanceRow>
                          {val.formValues?.amount
                            ? `${formatCoin(val.formValues.cryptoAmount)} ${
                                baseCoinfig.displaySymbol
                              }`
                            : `0 ${baseCoinfig.displaySymbol}`}
                        </BalanceRow>
                      </OptionValue>
                    </div>
                    <CoinAccountIcon accountType={BASE.type} coin={BASE.coin} />
                  </Option>
                  <Toggler
                    onClick={this.props.swapActions.toggleBaseAndCounter}
                    data-e2e='toggleBaseandCounter'
                  >
                    <Icon color='blue600' size='20px' name='arrow-up' />
                    <Icon color='blue600' size='20px' name='arrow-down' />
                  </Toggler>
                  <Option
                    role='button'
                    data-e2e='selectToAcct'
                    onClick={this.handleCounterCoinSelection}
                  >
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        <FormattedMessage
                          id='scenes.exchange.exchangeform.to'
                          defaultMessage='Receive'
                        />
                      </Text>
                      <OptionTitle>{COUNTER.label}</OptionTitle>
                      <OptionValue>
                        <BalanceRow>
                          <ResultAmount
                            isRefreshing={val.resultAmountViewModel.isRefreshing}
                            text={val.resultAmountViewModel.text}
                          />
                        </BalanceRow>
                      </OptionValue>
                    </div>
                    <CoinAccountIcon accountType={COUNTER.type} coin={COUNTER.coin} />
                  </Option>
                  <Border />
                </Options>
                <Checkout {...val} {...this.props} BASE={BASE} COUNTER={COUNTER} />
                {(showSilverRevampBanner || userData.tiers.current === 1) && (
                  <Upgrade {...this.props} />
                )}
              </>
            )
          })}
        </div>
      </>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    data: getData(state),
    initSwapFormValues: selectors.form.getFormValues('initSwap')(state) as InitSwapFormValuesType,
    isPristine: selectors.form.isPristine('swapAmount')(state),
    quotePriceR: selectors.components.swap.getQuotePrice(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  verifyIdentity: () => {
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'Swap',
        tier: 2
      })
    )
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.ONBOARDING_GET_MORE_ACCESS_WHEN_YOU_VERIFY,
        properties: {
          flow_step: 'SWAP'
        }
      })
    )
  }
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = BaseProps & { handleClose: () => void }
export type Props = OwnProps & SuccessType & ConnectedProps<typeof connector>
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>> & {
  formErrors: {
    amount?: 'ABOVE_MAX' | 'BELOW_MIN' | 'ABOVE_MAX_LIMIT' | 'ABOVE_BALANCE' | boolean
  }
}

// @ts-ignore
export default connector(EnterAmount)
