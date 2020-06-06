import { BaseFieldProps, Field, InjectedFormProps, reduxForm } from 'redux-form'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { Exchange } from 'core'
import { fiatToString, formatFiat } from 'core/exchange/currency'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, FormLabel, NumberBox } from 'components/Form'
import { InterestWithdrawalFormType } from 'data/components/interest/types'
import { required } from 'services/FormHelper'
import { selectors } from 'data'
import FiatDisplay from 'components/Display/FiatDisplay'

import { LinkDispatchPropsType, OwnProps, State, SuccessStateType } from '.'
import { maximumWithdrawalAmount, minimumWithdrawalAmount } from './validation'

const SendingWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`
const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Top = styled(FlyoutWrapper)`
  padding-bottom: 0;
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const ArrowIcon = styled(Icon)`
  margin-right: 20px;
`
const BalanceWrapper = styled.div`
  display: flex;
  margin-top: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.grey000};
`
const BalanceItem = styled.div`
  width: 100%;
  &:last-child {
    margin-left: 32px;
  }
`
const MaxAmountContainer = styled.div`
  display: flex;
  margin-top: 24px;
`
const AmountAvailContainer = styled.div`
  cursor: pointer;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  background-color: ${props => props.theme.grey000};
`
const Spacer = styled.div`
  height: 48px;
  border-right: 1px solid ${props => props.theme.grey000};
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`
const CustomFormLabel = styled(FormLabel)`
  display: block;
  margin-top: 24px;
  margin-bottom: 10px;
`
const CustomField = styled(Field)<BaseFieldProps>`
  > input {
    padding-left: 45px;
  }
`
const AmountFieldContainer = styled.div`
  display: flex;
  position: relative;
`
const PrincipalCcyAbsolute = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
`
const NetworkFee = styled.div`
  display: flex;
  flex-direction: column;
`
const Availability = styled.div`
  margin-top: 24px;
`
const ButtonContainer = styled.div<{ isOpacityApplied?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  opacity: ${({ isOpacityApplied }) => (isOpacityApplied ? 0.25 : 1)};
  > button {
    padding: 15px !important;
  }
`
const ToggleCoinFiat = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.blue600};
  cursor: pointer;
  display: inline;
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.grey000};
  margin: 0 0 5px 5px;
`

const FORM_NAME = 'interestWithdrawalForm'

const WithdrawalForm: React.FC<InjectedFormProps<{}, Props> &
  Props> = props => {
  const {
    accountBalances,
    availToWithdrawFiat,
    coin,
    accountBalanceStandard,
    displayCoin,
    formActions,
    handleDisplayToggle,
    interestActions,
    invalid,
    lockedCoin,
    rates,
    submitting,
    supportedCoins,
    values,
    walletCurrency
  } = props
  const handleFormSubmit = e => {
    e.preventDefault()
    interestActions.requestWithdrawal(coin, withdrawalAmountForm)
  }

  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const { coinTicker, displayName } = supportedCoins[coin]
  const account = accountBalances[coin]
  const accountInterestBalance = account && account.totalInterest
  const withdrawalAmount = (values && values.withdrawalAmount) || 0

  const withdrawalAmountFiat = displayCoin
    ? formatFiat(
        Exchange.convertCoinToFiat(
          withdrawalAmount,
          coin,
          walletCurrency,
          rates
        )
      )
    : formatFiat(withdrawalAmount)

  const withdrawalAmountCrypto = displayCoin
    ? withdrawalAmount
    : Exchange.convertFiatToBtc({
        fromCurrency: walletCurrency,
        toUnit: 'BTC',
        rates,
        value: withdrawalAmount
      }).value

  const withdrawalAmountForm = displayCoin
    ? withdrawalAmount
    : Exchange.convertCoinToCoin({
        value: Exchange.convertFiatToBtc({
          fromCurrency: walletCurrency,
          toUnit: 'SAT',
          rates,
          value: withdrawalAmount
        }).value,
        coin,
        baseToStandard: true
      }).value

  const interestBalanceStandard = Exchange.convertCoinToCoin({
    value: accountInterestBalance || 0,
    coin: 'BTC',
    baseToStandard: true
  }).value
  const availToWithdrawCrypto = accountBalanceStandard - lockedCoin

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
            onClick={() => interestActions.showInterestModal('ACCOUNT_SUMMARY')}
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
            {displayCoin ? (
              <Text
                color='grey800'
                size='20px'
                style={{ marginTop: '8px' }}
                weight={600}
              >
                {accountBalanceStandard}
              </Text>
            ) : (
              <FiatDisplay
                coin={coin}
                color='grey800'
                size='20px'
                style={{ marginTop: '8px' }}
                weight={600}
              >
                {account.balance}
              </FiatDisplay>
            )}
          </BalanceItem>
          <Spacer />
          <BalanceItem>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.interest.withdrawal.totalinterest'
                defaultMessage='Total Interest Earned'
              />
            </Text>
            {displayCoin ? (
              <Text
                color='grey800'
                size='20px'
                style={{ marginTop: '8px' }}
                weight={600}
              >
                {interestBalanceStandard}
              </Text>
            ) : (
              <FiatDisplay
                coin={coin}
                color='grey800'
                size='20px'
                style={{ marginTop: '8px' }}
                weight={600}
              >
                {account.totalInterest}
              </FiatDisplay>
            )}
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
            <ToggleCoinFiat
              data-e2e='toggleFiatCrypto'
              onClick={handleDisplayToggle}
            >
              {displayCoin ? (
                <FormattedMessage
                  id='modals.interest.deposit.showfiat'
                  defaultMessage='Show {walletCurrency}'
                  values={{ walletCurrency }}
                />
              ) : (
                <FormattedMessage
                  id='modals.interest.deposit.showcoin'
                  defaultMessage='Show {coinTicker}'
                  values={{ coinTicker }}
                />
              )}
            </ToggleCoinFiat>
          </Text>
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

const enhance = compose(
  reduxForm<{}, Props>({ form: FORM_NAME }),
  connect(mapStateToProps)
)

type LinkStatePropsType = {
  values?: InterestWithdrawalFormType
}

type SuccessOwnProps = {
  handleClose: () => void
  handleDisplayToggle: () => void
}

type Props = SuccessOwnProps &
  OwnProps &
  LinkStatePropsType &
  SuccessStateType &
  LinkDispatchPropsType &
  State

export default enhance(WithdrawalForm) as React.FunctionComponent<Props>
