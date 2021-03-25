import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { FlyoutWrapper } from 'components/Flyout'
import { CoinAccountListBalance } from 'components/Form'
import { selectors } from 'data'
import {
  InitSwapFormValuesType,
  SwapAccountType,
  SwapCoinType
} from 'data/components/swap/types'
import checkAccountZeroBalance from 'services/CheckAccountZeroBalance'

import { Props as BaseProps, SuccessStateType } from '..'
import {
  BalanceRow,
  CustomOption,
  FlexStartRow,
  IconBackground,
  Option,
  OptionTitle,
  OptionValue,
  StyledForm,
  TopText,
  TrendingIconRow
} from '../components'
import { getData } from './selectors'
import VerifyIdentity from './VerifyIdentity'

const SuggestedTextCustomBorder = styled.span`
  width: 100%;
  height: 1px;
  margin-left: 8px;
  background-color: ${props => props.theme['grey000']};
`

class InitSwapForm extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  state = {}

  componentDidMount() {
    this.props.swapActions.refreshAccounts()
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.swapActions.setStep({ step: 'ENTER_AMOUNT' })
  }

  getCustodialWallet = (accounts, coin: CoinType) => {
    return accounts[coin].filter(account => account.type === 'CUSTODIAL')[0]
  }

  handleStepCoinSelection = (
    accounts: { [key in SwapCoinType]: Array<SwapAccountType> }
  ) => {
    const isAccountZeroBalance = checkAccountZeroBalance(accounts)

    if (isAccountZeroBalance) {
      this.props.swapActions.setStep({
        step: 'NO_HOLDINGS'
      })
    } else {
      this.props.swapActions.setStep({
        step: 'COIN_SELECTION',
        options: {
          side: 'BASE'
        }
      })
    }
  }

  render() {
    const { accounts, coins, userData, values } = this.props
    return userData.tiers && userData.tiers.current !== 0 ? (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween marginBottom>
            <Icon name='arrow-switch-thick' color='blue600' size='24px' />
            <Icon
              name='close'
              color='grey600'
              role='button'
              data-e2e='close'
              size='24px'
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
            {(values?.BASE && !values?.COUNTER) ||
            (values?.COUNTER && !values?.BASE) ? (
              <FormattedMessage
                id='copy.select_swap_wallets'
                defaultMessage='Select the Wallet you want to Swap from and the crypto you want to receive.'
              />
            ) : (
              <FormattedMessage
                id='copy.instantly_exchange'
                defaultMessage='Instantly exchange your crypto into any currency we offer in your wallet.'
              />
            )}
          </Text>
        </FlyoutWrapper>
        <StyledForm onSubmit={this.handleSubmit}>
          <Field
            name='BASE'
            component={() => (
              <Option
                role='button'
                data-e2e='selectFromAcct'
                onClick={() => this.handleStepCoinSelection(accounts)}
              >
                {values?.BASE ? (
                  <>
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        <FormattedMessage
                          id='copy.swap_from'
                          defaultMessage='Swap from'
                        />
                      </Text>
                      <OptionTitle data-e2e='swapFromWallet'>
                        {values.BASE.label}
                      </OptionTitle>
                      <OptionValue>
                        <BalanceRow>
                          <CoinAccountListBalance
                            account={values.BASE}
                            walletCurrency={this.props.walletCurrency}
                          />
                        </BalanceRow>
                      </OptionValue>
                    </div>
                    <Icon
                      name={coins[values.BASE.coin].coinCode}
                      color={coins[values.BASE.coin].coinCode}
                      size='32px'
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        <FormattedMessage
                          id='copy.swap_from'
                          defaultMessage='Swap from'
                        />
                      </Text>
                      <>
                        <OptionTitle>Select a Wallet</OptionTitle>
                        <OptionValue color='grey900' weight={500}>
                          <FormattedMessage
                            id='copy.swap_crypto_send'
                            defaultMessage='This is the crypto you send.'
                          />
                        </OptionValue>
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
                data-e2e='selectToAcct'
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
                      <OptionValue>
                        <FormattedMessage
                          id='copy.receive_to'
                          defaultMessage='Receive to'
                        />
                      </OptionValue>
                      <OptionTitle data-e2e='swapToWallet' color='grey900'>
                        {values.COUNTER.label}
                      </OptionTitle>
                      <OptionValue>
                        <BalanceRow>
                          <CoinAccountListBalance
                            account={values.COUNTER}
                            walletCurrency={this.props.walletCurrency}
                          />
                        </BalanceRow>
                      </OptionValue>
                    </div>
                    <Icon
                      name={coins[values.COUNTER.coin].coinCode}
                      color={coins[values.COUNTER.coin].coinCode}
                      size='32px'
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <Text color='grey600' weight={500} size='14px'>
                        <FormattedMessage
                          id='copy.receive_to'
                          defaultMessage='Receive to'
                        />
                      </Text>
                      <>
                        <OptionTitle>Select a Wallet</OptionTitle>
                        <OptionValue color='grey900' weight={500}>
                          <FormattedMessage
                            id='copy.swap_crypto_get'
                            defaultMessage='This is the crypto you get.'
                          />
                        </OptionValue>
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
              height='48px'
              size='16px'
              disabled={!values?.BASE || !values?.COUNTER}
            >
              <FormattedMessage
                id='buttons.continue'
                defaultMessage='Continue'
              />
            </Button>
            <Text
              size='12px'
              cursor='pointer'
              color='blue600'
              data-e2e='resetInitSwap'
              weight={500}
              style={{
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'center',
                visibility:
                  values?.BASE && values.COUNTER ? 'visible' : 'hidden'
              }}
              onClick={() => this.props.formActions.destroy('initSwap')}
            >
              <FormattedMessage id='copy.reset' defaultMessage='Reset' />
            </Text>
          </FlyoutWrapper>
          <>
            <Text
              color='grey600'
              weight={500}
              size='14px'
              style={{
                margin: '0 0 0 40px',
                display: 'flex',
                alignItems: 'flex-end'
              }}
            >
              <FormattedMessage
                id='copy.suggested'
                defaultMessage='Suggested'
              />
              <SuggestedTextCustomBorder />
            </Text>
            <Field
              name='TRENDINGONE'
              component={() => (
                <CustomOption
                  role='button'
                  data-e2e='trending1'
                  onClick={() =>
                    this.props.swapActions.changeTrendingPair(
                      this.getCustodialWallet(accounts, 'BTC'),
                      this.getCustodialWallet(accounts, 'ETH')
                    )
                  }
                >
                  <FlexStartRow>
                    <TrendingIconRow>
                      <Icon
                        color='BTC'
                        name='BTC'
                        size='32px'
                        style={{ marginRight: '16px' }}
                      />
                      <IconBackground size='24px' position='absolute'>
                        <Icon
                          name='arrows-horizontal'
                          size='10px'
                          color='blue600'
                        />
                      </IconBackground>
                      <Icon color='ETH' name='ETH' size='32px' />
                    </TrendingIconRow>
                    <div>
                      <OptionTitle>Swap Bitcoin</OptionTitle>
                      <OptionValue>Receive Ethereum</OptionValue>
                    </div>
                  </FlexStartRow>
                  <Icon name='chevron-right' size='20px' color='grey400' />
                </CustomOption>
              )}
            />
            <Field
              name='TRENDINGTWO'
              component={() => (
                <CustomOption
                  role='button'
                  data-e2e='trending2'
                  onClick={() =>
                    this.props.swapActions.changeTrendingPair(
                      this.getCustodialWallet(accounts, 'ETH'),
                      this.getCustodialWallet(accounts, 'BTC')
                    )
                  }
                >
                  <FlexStartRow>
                    <TrendingIconRow>
                      <Icon
                        color='ETH'
                        name='ETH'
                        size='32px'
                        style={{ marginRight: '16px' }}
                      />
                      <IconBackground size='24px' position='absolute'>
                        <Icon
                          name='arrows-horizontal'
                          size='10px'
                          color='blue600'
                        />
                      </IconBackground>
                      <Icon color='BTC' name='BTC' size='32px' />
                    </TrendingIconRow>
                    <div>
                      <OptionTitle>Swap Ethereum</OptionTitle>
                      <OptionValue>Receive Bitcoin</OptionValue>
                    </div>
                  </FlexStartRow>
                  <Icon name='chevron-right' size='20px' color='grey400' />
                </CustomOption>
              )}
            />
            <Field
              name='TRENDINGTHREE'
              component={() => (
                <CustomOption
                  role='button'
                  data-e2e='trending3'
                  onClick={() =>
                    this.props.swapActions.changeTrendingPair(
                      this.getCustodialWallet(accounts, 'BTC'),
                      this.getCustodialWallet(accounts, 'PAX')
                    )
                  }
                >
                  <FlexStartRow>
                    <TrendingIconRow>
                      <Icon
                        color='BTC'
                        name='BTC'
                        size='32px'
                        style={{ marginRight: '16px' }}
                      />
                      <IconBackground size='24px' position='absolute'>
                        <Icon
                          name='arrows-horizontal'
                          size='10px'
                          color='blue600'
                        />
                      </IconBackground>
                      <Icon color='PAX' name='PAX' size='32px' />
                    </TrendingIconRow>
                    <div>
                      <OptionTitle>Swap BTC</OptionTitle>
                      <OptionValue>Receive USD Digital</OptionValue>
                    </div>
                  </FlexStartRow>
                  <Icon name='chevron-right' size='20px' color='grey400' />
                </CustomOption>
              )}
            />
          </>
        </StyledForm>
      </>
    ) : (
      // @ts-ignore
      <VerifyIdentity {...this.props} />
    )
  }
}

const mapStateToProps = state => ({
  latestPendingSwapTrade: selectors.components.swap.getLatestPendingSwapTrade(
    state
  ),
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
