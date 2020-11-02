import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import {
  BalanceRow,
  Option,
  OptionTitle,
  OptionValue,
  TopText
} from '../components'
import { Props as BaseProps, SuccessStateType as SuccessType } from '..'
import { ExtractSuccess } from 'core/types'
import { FlyoutWrapper } from 'components/Flyout'
import { formatCoin } from 'core/exchange/currency'
import { InitSwapFormValuesType } from 'data/types'
import { selectors } from 'data'

import { getData } from './selectors'
import Checkout from './Checkout'
import CoinBalance from '../components/CoinBalance'
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
  border: 1px solid ${props => props.theme['grey000']};
  background: ${props => props.theme['white']};
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
  state = {}

  componentDidMount () {
    this.props.swapActions.initAmountForm()
  }

  render () {
    if (
      !this.props.initSwapFormValues?.BASE ||
      !this.props.initSwapFormValues?.COUNTER
    ) {
      return this.props.swapActions.setStep({ step: 'INIT_SWAP' })
    }

    const { BASE, COUNTER } = this.props.initSwapFormValues
    const { coins, userData, walletCurrency } = this.props

    return (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween>
            <SubTopText>
              <Icon
                role='button'
                name='arrow-left'
                cursor
                size='24px'
                color='grey600'
                onClick={() =>
                  this.props.swapActions.setStep({
                    step: 'INIT_SWAP'
                  })
                }
              />{' '}
              <Text
                size='20px'
                color='grey900'
                weight={600}
                style={{ marginLeft: '16px' }}
              >
                <FormattedMessage
                  id='copy.new_swap'
                  defaultMessage='New Swap'
                />
              </Text>
            </SubTopText>
            {this.props.quoteR.cata({
              Success: val => (
                <Text size='14px' color='grey900' weight={500}>
                  1 {coins[BASE.coin].coinTicker} = {formatCoin(val.rate)}{' '}
                  {coins[COUNTER.coin].coinTicker}
                </Text>
              ),
              Failure: () => null,
              Loading: () => (
                <SpinningLoader borderWidth='4px' height='14px' width='14px' />
              ),
              NotAsked: () => (
                <SpinningLoader borderWidth='4px' height='14px' width='14px' />
              )
            })}
          </TopText>
        </FlyoutWrapper>
        <div>
          <Options>
            <Option
              role='button'
              onClick={() =>
                this.props.swapActions.setStep({
                  step: 'COIN_SELECTION',
                  options: {
                    side: 'BASE'
                  }
                })
              }
            >
              <div>
                <Text color='grey600' weight={500} size='14px'>
                  <FormattedMessage
                    id='copy.swap_from'
                    defaultMessage='Swap from'
                  />
                </Text>
                <OptionTitle>{BASE.label}</OptionTitle>
                <OptionValue>
                  <BalanceRow>
                    <CoinBalance
                      account={BASE}
                      walletCurrency={walletCurrency}
                    />
                  </BalanceRow>
                </OptionValue>
              </div>
              <Icon
                name={coins[BASE.coin].icons.circleFilled}
                color={coins[BASE.coin].colorCode}
                size='32px'
              />
            </Option>
            <Toggler
              onClick={this.props.swapActions.toggleBaseAndCounter}
              data-e2e='toggleBaseandCounter'
            >
              <Icon color='blue600' size='24px' name='arrow-up' />
              <Icon color='blue600' size='24px' name='arrow-down' />
            </Toggler>
            <Option
              role='button'
              onClick={() =>
                this.props.swapActions.setStep({
                  step: 'COIN_SELECTION',
                  options: {
                    side: 'COUNTER'
                  }
                })
              }
            >
              <div>
                <Text color='grey600' weight={500} size='14px'>
                  <FormattedMessage
                    id='copy.receive_to'
                    defaultMessage='Receive to'
                  />
                </Text>
                <OptionTitle>{COUNTER.label}</OptionTitle>
                <OptionValue>
                  <BalanceRow>
                    <CoinBalance
                      account={COUNTER}
                      walletCurrency={walletCurrency}
                    />
                  </BalanceRow>
                </OptionValue>
              </div>
              <Icon
                name={coins[COUNTER.coin].icons.circleFilled}
                color={coins[COUNTER.coin].colorCode}
                size='32px'
              />
            </Option>
          </Options>
          {this.props.data.cata({
            Success: val => (
              <>
                <Checkout {...val} {...this.props} BASE={BASE} />
                {userData.tiers.current === 1 && <Upgrade {...this.props} />}
              </>
            ),
            Failure: e => <Failure {...this.props} error={e} />,
            Loading: () => <Loading />,
            NotAsked: () => <Loading />
          })}
        </div>
      </>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    data: getData(state),
    initSwapFormValues: selectors.form.getFormValues('initSwap')(
      state
    ) as InitSwapFormValuesType,
    quoteR: selectors.components.swap.getQuote(state)
  }
}

const connector = connect(mapStateToProps)

type OwnProps = BaseProps & { handleClose: () => void }
export type Props = OwnProps & SuccessType & ConnectedProps<typeof connector>
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>> & {
  formErrors: { amount?: 'ABOVE_MAX' | 'BELOW_MIN' | boolean }
}

// @ts-ignore
export default connector(EnterAmount)
