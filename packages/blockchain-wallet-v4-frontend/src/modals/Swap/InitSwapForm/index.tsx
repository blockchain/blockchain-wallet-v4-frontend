import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React, { PureComponent } from 'react'

import {
  BalanceRow,
  IconBackground,
  Option,
  StyledForm,
  TopText,
  TrendingIconRow
} from '../components'
import { Props as BaseProps, SuccessStateType } from '..'
import { Button, Icon, Text } from 'blockchain-info-components'
import { compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { FlyoutWrapper } from 'components/Flyout'
import { getData } from './selectors'
import { InitSwapFormValuesType } from 'data/components/swap/types'
import { selectors } from 'data'
import FiatDisplay from 'components/Display/FiatDisplay'

class InitSwapForm extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  state = {}

  handleSubmit = e => {
    e.preventDefault()
    this.props.swapActions.setStep({ step: 'ENTER_AMOUNT' })
  }

  render () {
    const { accounts, coins, values, walletCurrency } = this.props
    return (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween marginBottom>
            <Icon name='arrow-switch-thick' color='blue600' size='24px' />
            <Icon
              name='close'
              color='grey600'
              role='button'
              cursor
              onClick={this.props.handleClose}
            />
          </TopText>
          <Text size='24px' color='grey900' weight={600}>
            <FormattedMessage id='copy.new_swap' defaultMessage='New Swap' />
          </Text>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            style={{ marginTop: '10px' }}
          >
            <FormattedMessage
              id='copy.select_swap_wallets'
              defaultMessage='Select the Wallet you want to Swap from and the crypto you want to receive.'
            />
          </Text>
        </FlyoutWrapper>
        <StyledForm onSubmit={this.handleSubmit} marginTop>
          <Field
            name='BASE'
            component={() => (
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
                {values?.BASE ? (
                  <>
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        Swap From
                      </Text>
                      <Text>{values.BASE.label}</Text>
                      <BalanceRow>
                        <FiatDisplay
                          color='grey800'
                          coin={values.BASE.coin}
                          currency={walletCurrency}
                          loadingHeight='24px'
                          style={{ lineHeight: '1.5' }}
                          weight={600}
                        >
                          {values.BASE.balance}
                        </FiatDisplay>
                        <Text>
                          (
                          {convertBaseToStandard(
                            values.BASE.coin,
                            values.BASE.balance
                          )}
                          )
                        </Text>
                      </BalanceRow>
                    </div>
                    <Icon
                      name={coins[values.BASE.coin].icons.circleFilled}
                      color={coins[values.BASE.coin].colorCode}
                      size='32px'
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        Swap from
                      </Text>
                      <>
                        <Text
                          color='grey900'
                          weight={600}
                          style={{ marginTop: '4px' }}
                        >
                          Select a Wallet
                        </Text>
                        <Text
                          color='grey900'
                          weight={600}
                          size='14px'
                          style={{ marginTop: '4px' }}
                        >
                          This is the crypto you send.
                        </Text>
                      </>
                    </div>
                    <Icon name='chevron-right' size='20px' color='grey400' />
                  </>
                )}
              </Option>
            )}
          />
          <Field
            name='COUNTER'
            component={() => (
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
                {values?.COUNTER ? (
                  <>
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        Receive to
                      </Text>
                      <Text>{values.COUNTER.label}</Text>
                      <BalanceRow>
                        <FiatDisplay
                          color='grey800'
                          coin={values.COUNTER.coin}
                          currency={walletCurrency}
                          loadingHeight='24px'
                          style={{ lineHeight: '1.5' }}
                          weight={600}
                        >
                          {values.COUNTER.balance}
                        </FiatDisplay>
                        <Text>
                          (
                          {convertBaseToStandard(
                            values.COUNTER.coin,
                            values.COUNTER.balance
                          )}
                          )
                        </Text>
                      </BalanceRow>
                    </div>
                    <Icon
                      name={coins[values.COUNTER.coin].icons.circleFilled}
                      color={coins[values.COUNTER.coin].colorCode}
                      size='32px'
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        Receive to
                      </Text>
                      <>
                        <Text
                          color='grey900'
                          weight={600}
                          style={{ marginTop: '4px' }}
                        >
                          Select a Wallet
                        </Text>
                        <Text
                          color='grey900'
                          weight={600}
                          size='14px'
                          style={{ marginTop: '4px' }}
                        >
                          This is the crypto you get.
                        </Text>
                      </>
                    </div>
                    <Icon name='chevron-right' size='20px' color='grey400' />
                  </>
                )}
              </Option>
            )}
          />
          <FlyoutWrapper>
            <Button
              nature='primary'
              data-e2e='continueSwap'
              type='submit'
              fullwidth
              jumbo
              disabled={!this.props.values?.BASE || !this.props.values.COUNTER}
            >
              <FormattedMessage
                id='buttons.continue'
                defaultMessage='Continue'
              />
            </Button>
          </FlyoutWrapper>
          {!values?.COUNTER ||
            (!values?.BASE && (
              <>
                <Text
                  color='grey600'
                  weight={500}
                  size='14px'
                  style={{ marginLeft: '40px' }}
                >
                  Trending
                </Text>
                <Field
                  name='TRENDINGONE'
                  component={() => (
                    <Option
                      role='button'
                      onClick={() =>
                        this.props.swapActions.changeTrendingPair(
                          accounts.BTC[0],
                          accounts.ETH[1]
                        )
                      }
                    >
                      <TrendingIconRow>
                        <Icon
                          color='btc'
                          name='btc-circle-filled'
                          size='32px'
                          style={{ marginRight: '16px' }}
                        />
                        <IconBackground color='blue000'>
                          <Icon
                            name='arrows-horizontal'
                            size='10px'
                            color='blue600'
                          />
                        </IconBackground>
                        <Icon
                          color='eth'
                          name='eth-circle-filled'
                          size='32px'
                        />
                      </TrendingIconRow>
                      <div>
                        <>
                          <Text
                            color='grey900'
                            weight={600}
                            style={{ marginTop: '4px' }}
                          >
                            Swap Bitcoin
                          </Text>
                          <Text color='grey600' weight={500} size='14px'>
                            Receive Ethereum
                          </Text>
                        </>
                      </div>
                      <Icon name='chevron-right' size='20px' color='grey400' />
                    </Option>
                  )}
                />
                <Field
                  name='TRENDINGTWO'
                  component={() => (
                    <Option
                      role='button'
                      onClick={() =>
                        this.props.swapActions.changeTrendingPair(
                          accounts.BCH[0],
                          accounts.XLM[0]
                        )
                      }
                    >
                      <TrendingIconRow>
                        <Icon
                          color='bch'
                          name='bch-circle-filled'
                          size='32px'
                          style={{ marginRight: '16px' }}
                        />
                        <IconBackground color='blue000'>
                          <Icon
                            name='arrows-horizontal'
                            size='10px'
                            color='blue600'
                          />
                        </IconBackground>
                        <Icon
                          color='xlm'
                          name='xlm-circle-filled'
                          size='32px'
                        />
                      </TrendingIconRow>
                      <div>
                        <>
                          <Text
                            color='grey900'
                            weight={600}
                            style={{ marginTop: '4px' }}
                          >
                            Swap Bitcoin Cash
                          </Text>
                          <Text color='grey600' weight={500} size='14px'>
                            Receive Stellar Lumens
                          </Text>
                        </>
                      </div>
                      <Icon name='chevron-right' size='20px' color='grey400' />
                    </Option>
                  )}
                />
                <Field
                  name='TRENDINGTHREE'
                  component={() => (
                    <Option
                      role='button'
                      onClick={() =>
                        this.props.swapActions.changeTrendingPair(
                          accounts.USDT[0],
                          accounts.ALGO[0]
                        )
                      }
                    >
                      <TrendingIconRow>
                        <Icon
                          color='usdt'
                          name='usdt'
                          size='32px'
                          style={{ marginRight: '16px' }}
                        />
                        <IconBackground color='blue000'>
                          <Icon
                            name='arrows-horizontal'
                            size='10px'
                            color='blue600'
                          />
                        </IconBackground>
                        <Icon color='algo' name='algo' size='32px' />
                      </TrendingIconRow>
                      <div>
                        <>
                          <Text
                            color='grey900'
                            weight={600}
                            style={{ marginTop: '4px' }}
                          >
                            Swap USDT
                          </Text>
                          <Text color='grey600' weight={500} size='14px'>
                            Receive Algorand
                          </Text>
                        </>
                      </div>
                      <Icon name='chevron-right' size='20px' color='grey400' />
                    </Option>
                  )}
                />
              </>
            ))}
        </StyledForm>
      </>
    )
  }
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType,
  ...getData(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  reduxForm<{}, Props>({ form: 'initSwap', destroyOnUnmount: false }),
  connector
)

type OwnProps = BaseProps & SuccessStateType & { handleClose: () => void }

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(InitSwapForm) as React.ComponentClass<OwnProps>
