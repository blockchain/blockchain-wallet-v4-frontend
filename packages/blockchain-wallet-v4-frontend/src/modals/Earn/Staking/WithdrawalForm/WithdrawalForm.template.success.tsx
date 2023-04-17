import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import {
  IconCloseCircleV2,
  Padding,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import { compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'

import { Exchange } from '@core'
import { convertCoinToCoin, convertCoinToFiat, convertFiatToCoin } from '@core/exchange'
import { fiatToString, formatFiat } from '@core/exchange/utils'
import { CoinType, EarnAccountBalanceResponseType, FiatType, RatesType } from '@core/types'
import { Button, Icon, SpinningLoader } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import AmountFieldInput from 'components/Form/AmountFieldInput'
import { Analytics, StakingWithdrawalFormType } from 'data/types'
import { useSardineContext } from 'hooks'
import { required } from 'services/forms'

import CustodialAccount from '../../CustodialAccount'
import { amountToCrypto, amountToFiat } from '../../Earn.utils'
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
  CloseIconContainer,
  CustomField,
  CustomForm,
  CustomFormLabel,
  CustomOrangeCartridge,
  FORM_NAME,
  MaxAmountContainer,
  NetworkFee,
  PrincipalCcyAbsolute,
  SendingWrapper,
  ToggleCoinFiat,
  ToggleCoinText,
  ToggleFiatText,
  Top,
  TopText,
  Wrapper
} from './WithdrawalForm.model'
import { getActions } from './WithdrawalForm.selectors'

const WithdrawalForm: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const dispatch = useDispatch()
  const { analyticsActions, earnActions, formActions } = getActions(dispatch)
  const {
    // accountBalances,
    // analyticsActions,
    buySellCryptoAmount,
    buySellFiatAmount,
    // displayCoin,
    // earnEDDStatus,
    // earnEDDWithdrawLimits,
    // flagEDDInterestFileUpload,

    coin,
    formValues,

    handleClose,
    invalid,
    rates,
    stakingCryptoAmount,
    stakingFiatAmount,
    submitting,
    walletCurrency
  } = props

  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const { coinfig } = window.coins[coin]
  const coinTicker = coinfig.displaySymbol
  const displayName = coinfig.name
  const handleSubmitPlaceholder = () => {}

  const { amount, fix } = formValues
  // console.log(rates, 'rates')
  // console.log(amount, 'amount')

  const withdrawalAmountCrypto =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency: walletCurrency,
          maxPrecision: 8,
          rates,
          value: amount
        })
      : amount
  const withdrawalAmountFiat =
    fix === 'CRYPTO'
      ? Exchange.displayCoinToFiat({
          rates,
          toCurrency: walletCurrency,
          value: amount || 0
        })
      : amount

  const quote = fix === 'CRYPTO' ? withdrawalAmountFiat : withdrawalAmountCrypto

  return submitting ? (
    <SendingWrapper>
      <SpinningLoader />
      <Text variant='subheading' color={SemanticColors.title} style={{ marginTop: '24px' }}>
        <FormattedMessage
          id='modals.interest.withdrawal.progress'
          defaultMessage='In Progress...'
        />
      </Text>
      <Text variant='paragraph1' color={SemanticColors.body} style={{ marginTop: '24px' }}>
        <FormattedMessage
          id='modals.interest.withdrawal.progressmsg'
          defaultMessage='Requesting a withdrawal from your Rewards Account'
        />
      </Text>
    </SendingWrapper>
  ) : (
    <CustomForm onSubmit={handleSubmitPlaceholder}>
      <Top>
        <TopText>
          <Text color={SemanticColors.title} variant='subheading'>
            <FormattedMessage
              id='copy.unstake_coin'
              defaultMessage='Unstake {value}'
              values={{ value: displayName }}
            />
          </Text>
          <CloseIconContainer>
            <IconCloseCircleV2 color={SemanticColors.muted} onClick={handleClose} size='medium' />
          </CloseIconContainer>
        </TopText>
        <Padding bottom={0.5}>
          <Text color={SemanticColors.body} variant='paragraph1'>
            <FormattedMessage defaultMessage='From' id='copy.from' />
          </Text>
        </Padding>
        <Padding bottom={3.5}>
          <CustodialAccount
            coin={coin}
            cryptoAmount={stakingCryptoAmount}
            fiatAmount={stakingFiatAmount}
            product='Staking'
          />
        </Padding>
        <AmountFieldInput
          amountError={false}
          coin={coin}
          fiatCurrency={walletCurrency}
          quote={quote}
          name='withdrawalAmount'
          showCounter
          showToggle
          onToggleFix={() => {
            formActions.change(FORM_NAME, 'fix', fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO')
            formActions.change(
              FORM_NAME,
              'amount',
              fix === 'CRYPTO' ? withdrawalAmountFiat : withdrawalAmountCrypto
            )
          }}
          data-e2e='stakingWithdrawalAmountFied'
          fix={fix}
        />
        <Padding bottom={0.5}>
          <Text color={SemanticColors.body} variant='paragraph1'>
            <FormattedMessage defaultMessage='To' id='copy.to' />
          </Text>
        </Padding>
        <CustodialAccount
          coin={coin}
          cryptoAmount={buySellCryptoAmount}
          fiatAmount={buySellFiatAmount}
          product='Trading'
        />
      </Top>

      <Bottom>
        <NetworkFee>
          <Text color={SemanticColors.body} variant='paragraph1'>
            <FormattedMessage
              id='modals.staking.withdrawal.recap'
              defaultMessage='You are requesting to withdraw <b>{withdrawalAmountFiat}</b> ({withdrawalAmountCrypto})from your Staking Account. This balance will be available in your Trading Account after {unbondingDays} days. After confirming this withdrawal, you will not continue to earn staking rewards on the amount withdrawn.'
              values={{
                unbondingDays: 'placeholder days',
                withdrawalAmountCrypto: `${withdrawalAmountCrypto} ${coinTicker}`,
                withdrawalAmountFiat: `${currencySymbol}${formatFiat(withdrawalAmountFiat)}`
              }}
            />
          </Text>
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
            <Text color={SemanticColors.background} variant='paragraph1'>
              <FormattedMessage id='buttons.confirm_withdraw' defaultMessage='Confirm Withdraw' />
            </Text>
          </Button>
        </ButtonContainer>
      </Bottom>
    </CustomForm>
  )
}

const enhance = compose(
  reduxForm<{}, Props>({ form: FORM_NAME, initialValues: { amount: '0', fix: 'CRYPTO' } })
)

type Props = {
  accountBalances: EarnAccountBalanceResponseType
  buySellCryptoAmount: string
  buySellFiatAmount: string
  coin: CoinType
  formValues: StakingWithdrawalFormType
  handleClose: () => void
  rates: RatesType
  stakingCryptoAmount: string
  stakingFiatAmount: string
  walletCurrency: FiatType
}

export default enhance(WithdrawalForm)
