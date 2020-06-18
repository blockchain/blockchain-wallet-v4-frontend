import { compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import React from 'react'

import { Button, SpinningLoader, Text } from 'blockchain-info-components'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { Exchange } from 'core'
import { fiatToString } from 'core/exchange/currency'

import { InterestWithdrawalFormType } from 'data/components/interest/types'
import { NumberBox } from 'components/Form'
import { required } from 'services/FormHelper'
import { selectors } from 'data'
import FiatDisplay from 'components/Display/FiatDisplay'

import {
  AmountAvailContainer,
  AmountFieldContainer,
  ArrowIcon,
  Availability,
  BalanceItem,
  BalanceWrapper,
  Bottom,
  ButtonContainer,
  CustomField,
  CustomForm,
  CustomFormLabel,
  MaxAmountContainer,
  NetworkFee,
  PrincipalCcyAbsolute,
  SendingWrapper,
  Spacer,
  ToggleCoinFiat,
  ToggleCoinText,
  ToggleFiatText,
  Top,
  Wrapper
} from './model'
import { amountToCrypto, amountToFiat } from '../conversions'
import { convertCoinToFiat } from 'core/exchange'
import { LinkDispatchPropsType, SuccessStateType } from '.'
import { maximumWithdrawalAmount, minimumWithdrawalAmount } from './validation'

const FORM_NAME = 'interestWithdrawalForm'

const WithdrawalForm: React.FC<InjectedFormProps<{}, Props> &
  Props> = props => {
  const {
    accountBalances,
    availToWithdraw,
    coin,
    displayCoin,
    formActions,
    handleDisplayToggle,
    interestActions,
    invalid,
    rates,
    submitting,
    supportedCoins,
    values,
    walletCurrency
  } = props
  const handleFormSubmit = e => {
    e.preventDefault()
    interestActions.requestWithdrawal(coin, withdrawalAmountCrypto)
  }

  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const { coinTicker, displayName } = supportedCoins[coin]
  const account = accountBalances[coin]
  const accountBalanceBase = account && account.balance
  const interestBalanceBase = account && account.totalInterest
  const accountBalanceStandard = convertBaseToStandard(coin, accountBalanceBase)
  const interestBalanceStandard = convertBaseToStandard(
    coin,
    interestBalanceBase
  )
  const withdrawalAmount = (values && values.withdrawalAmount) || 0

  const availToWithdrawCrypto = convertBaseToStandard(coin, availToWithdraw)
  const availToWithdrawFiat = convertCoinToFiat(
    availToWithdrawCrypto,
    coin,
    walletCurrency,
    rates
  )

  const withdrawalAmountFiat = amountToFiat(
    displayCoin,
    withdrawalAmount,
    coin,
    walletCurrency,
    rates
  )

  const withdrawalAmountCrypto = amountToCrypto(
    displayCoin,
    withdrawalAmount,
    coin,
    walletCurrency,
    rates
  )

  if (!account) return null

  return submitting ? (
    <SendingWrapper>
      <SpinningLoader />
      <Text
        weight={600}
        color='grey800'
        size='20px'
        style={{ marginTop: '24px' }}
      >
        <FormattedMessage
          id='modals.interest.withdrawal.progress'
          defaultMessage='In Progress...'
        />
      </Text>
      <Text
        weight={600}
        color='grey600'
        size='16px'
        style={{ marginTop: '24px' }}
      >
        <FormattedMessage
          id='modals.interest.withdrawal.progressmsg'
          defaultMessage='Requesting a withdrawal from your Interest Account'
        />
      </Text>
    </SendingWrapper>
  ) : (
    <CustomForm onSubmit={handleFormSubmit}>
      <Top>
        <Wrapper>
          <ArrowIcon
            color='grey600'
            cursor
            name='arrow-left'
            onClick={() =>
              interestActions.showInterestModal('ACCOUNT_SUMMARY', coin)
            }
            size='20px'
          />
          <Text color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='modals.interest.withdrawal.title'
              defaultMessage='Withdraw {displayName}'
              values={{ displayName }}
            />
          </Text>
        </Wrapper>
        <BalanceWrapper>
          <BalanceItem>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.interest.withdrawal.balance'
                defaultMessage='Your {coin} Balance'
                values={{ coin }}
              />
            </Text>

            <Text
              color='grey800'
              size='18px'
              style={{ marginTop: '8px' }}
              weight={600}
            >
              {accountBalanceStandard} {coin}
            </Text>

            <FiatDisplay
              coin={coin}
              color='grey600'
              size='14px'
              style={{ marginTop: '5px' }}
              weight={500}
            >
              {account.balance}
            </FiatDisplay>
          </BalanceItem>
          <Spacer />
          <BalanceItem>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.interest.withdrawal.totalinterest'
                defaultMessage='Total Interest Earned'
              />
            </Text>

            <Text
              color='grey800'
              size='18px'
              style={{ marginTop: '8px' }}
              weight={600}
            >
              {interestBalanceStandard} {coin}
            </Text>

            <FiatDisplay
              coin={coin}
              color='grey600'
              size='14px'
              style={{ marginTop: '5px' }}
              weight={600}
            >
              {account.totalInterest}
            </FiatDisplay>
          </BalanceItem>
        </BalanceWrapper>
        <MaxAmountContainer>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.withdrawal.availamount'
              defaultMessage='You can withdraw up to'
            />{' '}
            {displayCoin ? (
              <AmountAvailContainer
                onClick={() =>
                  formActions.change(
                    FORM_NAME,
                    'withdrawalAmount',
                    availToWithdrawCrypto
                  )
                }
              >
                <Text color='blue600' size='14px' weight={500}>
                  {availToWithdrawCrypto} {coinTicker}
                </Text>
              </AmountAvailContainer>
            ) : (
              <AmountAvailContainer
                onClick={() =>
                  formActions.change(
                    FORM_NAME,
                    'withdrawalAmount',
                    availToWithdrawFiat
                  )
                }
              >
                <Text color='blue600' size='14px' weight={500}>
                  {fiatToString({
                    value: availToWithdrawFiat,
                    unit: walletCurrency
                  })}
                </Text>
              </AmountAvailContainer>
            )}
          </Text>
        </MaxAmountContainer>
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.withdrawal.enteramount'
              defaultMessage='Enter withdrawal amount'
            />
          </Text>
          <ToggleCoinFiat>
            <ToggleFiatText
              displayCoin={displayCoin}
              onClick={() => handleDisplayToggle(false)}
            >
              {walletCurrency}
            </ToggleFiatText>
            |{' '}
            <ToggleCoinText
              displayCoin={displayCoin}
              onClick={() => handleDisplayToggle(true)}
            >
              {coinTicker}
            </ToggleCoinText>
          </ToggleCoinFiat>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            component={NumberBox}
            data-e2e='withdrawalAmount'
            name='withdrawalAmount'
            validate={[
              required,
              maximumWithdrawalAmount,
              minimumWithdrawalAmount
            ]}
            {...{
              errorBottom: true,
              errorLeft: true,
              errorIcon: 'alert-filled'
            }}
          />
          <PrincipalCcyAbsolute>
            {displayCoin ? (
              <Text color='grey800' size='14px' weight={600}>
                {coinTicker}
              </Text>
            ) : (
              <Text color='grey800' size='14px' weight={600}>
                {currencySymbol}
              </Text>
            )}
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
      </Top>
      <Bottom>
        <NetworkFee>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.withdrawal.recap'
              defaultMessage='You are requesting to withdraw {withdrawalAmountFiat} ({withdrawalAmountCrypto}) from your Interest Account. After confirming this withdrawal, you will not continue to earn interest on the amount withdrawn.'
              values={{
                withdrawalAmountFiat: `${currencySymbol}${withdrawalAmountFiat}`,
                withdrawalAmountCrypto: `${withdrawalAmountCrypto} ${coin}`
              }}
            />
          </Text>
          <Availability>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.interest.withdrawal.availability'
                defaultMessage='A small network fee will be applied, and your {coin} will be available in your {coin} Wallet within 2 days.'
                values={{ coin }}
              />
            </Text>
          </Availability>
        </NetworkFee>

        <ButtonContainer>
          <Button
            data-e2e='interestWithdrawalSubmit'
            disabled={invalid}
            fullwidth
            height='48px'
            nature='primary'
            type='submit'
          >
            <Text size='16px' weight={600} color='white'>
              <FormattedMessage
                id='buttons.confirm_withdraw'
                defaultMessage='Confirm Withdraw'
              />
            </Text>
          </Button>
        </ButtonContainer>
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues(FORM_NAME)(state)
})

type LinkStatePropsType = {
  values?: InterestWithdrawalFormType
}

type OwnProps = {
  handleDisplayToggle: (boolean) => void
}

export type Props = OwnProps &
  LinkStatePropsType &
  SuccessStateType &
  LinkDispatchPropsType

const enhance = compose(
  reduxForm<{}, Props>({ form: FORM_NAME }),
  connect(mapStateToProps)
)

export default enhance(WithdrawalForm) as React.FunctionComponent<Props>
