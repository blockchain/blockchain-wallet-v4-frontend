import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'

import { Exchange } from '@core'
import { convertCoinToFiat } from '@core/exchange'
import { fiatToString, formatFiat } from '@core/exchange/utils'
import { FiatType } from '@core/types'
import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import CoinBalanceDropdown from 'components/Form/CoinBalanceDropdown'
import NumberBox from 'components/Form/NumberBox'
import Spacer from 'components/Spacer'
import { selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { InterestWithdrawalFormType } from 'data/components/interest/types'
import { Analytics } from 'data/types'
import { useSardineContext } from 'hooks'
import { required } from 'services/forms'

import { amountToCrypto, amountToFiat } from '../conversions'
import { LinkDispatchPropsType, SuccessStateType } from '.'
import {
  AmountAvailContainer,
  AmountFieldContainer,
  ArrowIcon,
  Availability,
  BalanceItem,
  BalanceWrapper,
  Bottom,
  ButtonContainer,
  CartrigeText,
  CustomField,
  CustomForm,
  CustomFormLabel,
  CustomOrangeCartridge,
  MaxAmountContainer,
  NetworkFee,
  PrincipalCcyAbsolute,
  SendingWrapper,
  ToggleCoinFiat,
  ToggleCoinText,
  ToggleFiatText,
  Top,
  Wrapper
} from './model'
import { maximumWithdrawalAmount, minimumWithdrawalAmount } from './validation'

const FORM_NAME = 'interestWithdrawalForm'

// eslint-disable-next-line
const WithdrawalForm: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const [sardineContextIsReady, sardineContext] = useSardineContext('WITHDRAWAL')
  const {
    accountBalances,
    analyticsActions,
    availToWithdraw,
    coin,
    displayCoin,
    earnEDDStatus,
    earnEDDWithdrawLimits,
    flagEDDInterestFileUpload,
    formActions,
    handleDisplayToggle,
    interestActions,
    invalid,
    rates,
    submitting,
    values,
    walletCurrency
  } = props

  const accountType = values?.earnWithdrawalAccount.type
  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const { coinfig } = window.coins[coin]
  const coinTicker = coinfig.displaySymbol
  const displayName = coinfig.name
  const account = accountBalances[coin]
  const accountBalanceBase = account && account.balance
  const interestBalanceBase = account && account.totalInterest
  const accountBalanceStandard = convertBaseToStandard(coin, accountBalanceBase)
  const interestBalanceStandard = convertBaseToStandard(coin, interestBalanceBase)
  const availToWithdrawCrypto = convertBaseToStandard(coin, availToWithdraw)
  const withdrawalAmount = (values && values.withdrawalAmount) || 0
  const availToWithdrawFiat = convertCoinToFiat({
    coin,
    currency: walletCurrency,
    isStandard: true,
    rates,
    value: availToWithdrawCrypto
  })
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

  const handleOnClickCryptoAmount = useCallback(() => {
    analyticsActions.trackEvent({
      key: Analytics.WALLET_REWARDS_WITHDRAW_MAX_AMOUNT_CLICKED,
      properties: {
        currency: coin
      }
    })
    formActions.change(FORM_NAME, 'withdrawalAmount', availToWithdrawCrypto)
  }, [coin])

  const handleOnClickFiatAmount = useCallback(() => {
    analyticsActions.trackEvent({
      key: Analytics.WALLET_REWARDS_WITHDRAW_MAX_AMOUNT_CLICKED,
      properties: {
        currency: coin
      }
    })
    formActions.touch(FORM_NAME, 'withdrawalAmount')
    formActions.change(FORM_NAME, 'withdrawalAmount', availToWithdrawFiat)
  }, [coin])

  if (!account) return null

  const showEDDWithdrawLimit =
    (earnEDDWithdrawLimits?.withdrawLimits
      ? Number(withdrawalAmountFiat) > Number(earnEDDWithdrawLimits?.withdrawLimits.amount)
      : false) &&
    !earnEDDStatus?.eddSubmitted &&
    !earnEDDStatus?.eddPassed

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    analyticsActions.trackEvent({
      key: Analytics.WALLET_REWARDS_WITHDRAW_TRANSFER_CLICKED,
      properties: {
        amount: withdrawalAmountCrypto,
        amount_usd: withdrawalAmountFiat,
        currency: coin,
        type: accountType === 'CUSTODIAL' ? 'TRADING' : 'USERKEY'
      }
    })
    interestActions.requestWithdrawal({
      coin,
      withdrawalAmountCrypto,
      withdrawalAmountFiat
    })
    props.setShowSupply(showEDDWithdrawLimit)
    if (sardineContextIsReady) {
      sardineContext.updateConfig({
        flow: 'WITHDRAWAL'
      })
    }
  }

  return submitting ? (
    <SendingWrapper>
      <SpinningLoader />
      <Text weight={600} color='grey800' size='20px' style={{ marginTop: '24px' }}>
        <FormattedMessage
          id='modals.interest.withdrawal.progress'
          defaultMessage='In Progress...'
        />
      </Text>
      <Text weight={600} color='grey600' size='16px' style={{ marginTop: '24px' }}>
        <FormattedMessage
          id='modals.interest.withdrawal.progressmsg'
          defaultMessage='Requesting a withdrawal from your Rewards Account'
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
            onClick={() => interestActions.showInterestModal({ coin, step: 'ACCOUNT_SUMMARY' })}
            size='20px'
          />
          <Text color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='buttons.withdraw_value'
              defaultMessage='Withdraw {value}'
              values={{ value: displayName }}
            />
          </Text>
        </Wrapper>
        <BalanceWrapper>
          <BalanceItem>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.interest.withdrawal.balance2'
                defaultMessage='Your Rewards Balance'
              />
            </Text>

            <Text color='grey800' size='18px' style={{ marginTop: '8px' }} weight={600}>
              {accountBalanceStandard} {coinTicker}
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
                defaultMessage='Total Rewards Earned'
              />
            </Text>

            <Text color='grey800' size='18px' style={{ marginTop: '8px' }} weight={600}>
              {interestBalanceStandard} {coinTicker}
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
              id='modals.interest.withdrawal.accountAmount'
              defaultMessage='Select the account you would like to withdraw your Rewards Account funds to. You can withdraw up to'
            />{' '}
            {displayCoin ? (
              <AmountAvailContainer onClick={handleOnClickCryptoAmount}>
                <Text color='blue600' size='14px' weight={500}>
                  {availToWithdrawCrypto} {coinTicker}
                </Text>
              </AmountAvailContainer>
            ) : (
              <AmountAvailContainer onClick={handleOnClickFiatAmount}>
                <Text color='blue600' size='14px' weight={500}>
                  {fiatToString({
                    unit: walletCurrency,
                    value: availToWithdrawFiat
                  })}
                </Text>
              </AmountAvailContainer>
            )}
          </Text>
        </MaxAmountContainer>
        <CoinBalanceDropdown
          {...props}
          includeCustodial
          fiatCurrency={walletCurrency}
          name='earnWithdrawalAccount'
        />

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
              data-e2e='toggleFiat'
            >
              {walletCurrency}
            </ToggleFiatText>
            |{' '}
            <ToggleCoinText
              displayCoin={displayCoin}
              onClick={() => handleDisplayToggle(true)}
              data-e2e='toggleCoin'
            >
              {coinTicker}
            </ToggleCoinText>
          </ToggleCoinFiat>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            coin={coin}
            component={NumberBox}
            data-e2e='withdrawalAmount'
            displayCoin={displayCoin}
            name='withdrawalAmount'
            validate={[required, maximumWithdrawalAmount, minimumWithdrawalAmount]}
            {...{
              errorBottom: true,
              errorIcon: 'alert-filled',
              errorLeft: true
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

        {showEDDWithdrawLimit && flagEDDInterestFileUpload && (
          <CartrigeText>
            <Text color='orange600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.withdrawal.edd_need_further_information'
                defaultMessage='We will need to further verify your identity to make this withdrawal.'
              />
            </Text>
          </CartrigeText>
        )}

        {showEDDWithdrawLimit && !flagEDDInterestFileUpload && (
          <CustomOrangeCartridge>
            <Icon name='info' color='orange600' size='18px' style={{ marginRight: '12px' }} />
            <CartrigeText>
              <FormattedMessage
                id='modals.interest.withdrawal.edd_need'
                defaultMessage='This amount requires further information. Confirm the withdrawal and follow the instructions on the next screen.'
              />
            </CartrigeText>
          </CustomOrangeCartridge>
        )}
      </Top>
      <Bottom>
        <NetworkFee>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.withdrawal.recap'
              defaultMessage='You are requesting to withdraw <b>{withdrawalAmountFiat}</b> ({withdrawalAmountCrypto}) from your Rewards Account. After confirming this withdrawal, you will not continue to earn rewards on the amount withdrawn.'
              values={{
                withdrawalAmountCrypto: `${withdrawalAmountCrypto} ${coinTicker}`,
                withdrawalAmountFiat: `${currencySymbol}${formatFiat(withdrawalAmountFiat)}`
              }}
            />
          </Text>
          <Availability>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.interest.withdrawal.available'
                defaultMessage='A small network fee will be applied, and your {coinTicker} will be available in your {coinTicker} Wallet within 2 days.'
                values={{ coinTicker }}
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
              <FormattedMessage id='buttons.confirm_withdraw' defaultMessage='Confirm Withdraw' />
            </Text>
          </Button>
        </ButtonContainer>
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = (state) => ({
  values: selectors.form.getFormValues(FORM_NAME)(state)
})

type LinkStatePropsType = {
  values?: InterestWithdrawalFormType
}

type OwnProps = {
  handleDisplayToggle: (boolean) => void
  setShowSupply: (boolean) => void
  walletCurrency: FiatType
}

export type Props = OwnProps & LinkStatePropsType & SuccessStateType & LinkDispatchPropsType

// @ts-ignore
const enhance = compose(
  reduxForm<{ form: string }, Props>({ form: FORM_NAME }),
  connect(mapStateToProps)
)

export default enhance(WithdrawalForm) as React.FunctionComponent<Props>
