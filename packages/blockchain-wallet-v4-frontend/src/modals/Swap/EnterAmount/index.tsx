import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { CoinAccountIcon, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { formatCoin } from 'blockchain-wallet-v4/src/exchange/utils'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { FlyoutWrapper } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { InitSwapFormValuesType, SwapAccountType, SwapCoinType } from 'data/types'

import { Props as BaseProps, SuccessStateType as SuccessType } from '..'
import { BalanceRow, Border, Option, OptionTitle, OptionValue, TopText } from '../components'
import { checkAccountZeroBalance } from '../model'
import Checkout from './Checkout'
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
  }

  handleStepCoinSelection = (accounts: { [key in SwapCoinType]: Array<SwapAccountType> }) => {
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
  }

  render() {
    if (!this.props.initSwapFormValues?.BASE || !this.props.initSwapFormValues?.COUNTER) {
      return this.props.swapActions.setStep({ step: 'INIT_SWAP' })
    }

    const { BASE, COUNTER } = this.props.initSwapFormValues
    const { userData } = this.props

    const { coinfig: baseCoinfig } = window.coins[BASE.coin]
    const { coinfig: counterCoinfig } = window.coins[COUNTER.coin]

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
                onClick={() =>
                  this.props.swapActions.setStep({
                    step: 'INIT_SWAP'
                  })
                }
              />{' '}
              <Text size='20px' color='grey900' weight={600} style={{ marginLeft: '16px' }}>
                <FormattedMessage id='copy.new_swap' defaultMessage='New Swap' />
              </Text>
            </SubTopText>
            {this.props.quoteR.cata({
              Failure: () => null,
              Loading: () => <SpinningLoader borderWidth='4px' height='14px' width='14px' />,
              NotAsked: () => <SpinningLoader borderWidth='4px' height='14px' width='14px' />,
              Success: (val) => (
                <Text size='14px' color='grey900' weight={500}>
                  1 {baseCoinfig.displaySymbol} = {formatCoin(val.rate)}{' '}
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
                    onClick={() => this.handleStepCoinSelection(val.accounts)}
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
                    onClick={() =>
                      this.props.swapActions.setStep({
                        options: {
                          side: 'COUNTER'
                        },
                        step: 'COIN_SELECTION'
                      })
                    }
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
                          {val.formValues?.amount
                            ? `${formatCoin(val.incomingAmount.amt)} ${
                                counterCoinfig.displaySymbol
                              }`
                            : `0 ${counterCoinfig.displaySymbol}`}
                        </BalanceRow>
                      </OptionValue>
                    </div>
                    <CoinAccountIcon accountType={COUNTER.type} coin={COUNTER.coin} />
                  </Option>
                  <Border />
                </Options>
                <Checkout {...val} {...this.props} BASE={BASE} COUNTER={COUNTER} />
                {userData.tiers.current === 1 && <Upgrade {...this.props} />}
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
    quoteR: selectors.components.swap.getQuote(state)
  }
}

const connector = connect(mapStateToProps)

type OwnProps = BaseProps & { handleClose: () => void }
export type Props = OwnProps & SuccessType & ConnectedProps<typeof connector>
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>> & {
  formErrors: {
    amount?: 'ABOVE_MAX' | 'BELOW_MIN' | 'NEGATIVE_INCOMING_AMT' | boolean
  }
}

// @ts-ignore
export default connector(EnterAmount)
