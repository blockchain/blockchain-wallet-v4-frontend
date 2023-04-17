import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import {
  Flex,
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
  Bottom,
  ButtonContainer,
  CloseIconContainer,
  CustomForm,
  FORM_NAME,
  NetworkFee,
  PercentageButton,
  SendingWrapper,
  Top,
  TopText
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
    unbondingDays,
    walletCurrency
  } = props

  const [percentageOfBalance, setPercentageOfBalance] = useState(0)
  const { amount, fix } = formValues || { amount: '0', fix: 'CRYPTO' }
  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const { coinfig } = window.coins[coin]
  const coinTicker = coinfig.displaySymbol
  const displayName = coinfig.name
  const handleSubmitPlaceholder = () => {}

  const handlePercentBalanceClick = (percent) => {
    setPercentageOfBalance(percent)
    const cryptoAmount = (Number(stakingCryptoAmount) * percent).toString()
    const fiatAmount = convertCoinToFiat({
      coin,
      currency: walletCurrency,
      isStandard: true,
      rates,
      value: cryptoAmount || 0
    })
    formActions.change(FORM_NAME, 'amount', fix === 'CRYPTO' ? cryptoAmount : fiatAmount)
  }

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
      ? convertCoinToFiat({
          coin,
          currency: walletCurrency,
          isStandard: true,
          rates,
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
          name='amount'
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
          onChange={() => setPercentageOfBalance(0)}
        />
        <Flex justifyContent='space-between'>
          <PercentageButton
            onClick={() => handlePercentBalanceClick(0.25)}
            selected={percentageOfBalance === 0.25}
          >
            <Text color={SemanticColors.primary} variant='body2'>
              25%
            </Text>
          </PercentageButton>
          <PercentageButton
            onClick={() => handlePercentBalanceClick(0.5)}
            selected={percentageOfBalance === 0.5}
          >
            <Text color={SemanticColors.primary} variant='body2'>
              50%
            </Text>
          </PercentageButton>
          <PercentageButton
            onClick={() => handlePercentBalanceClick(0.75)}
            selected={percentageOfBalance === 0.75}
          >
            <Text color={SemanticColors.primary} variant='body2'>
              75%
            </Text>
          </PercentageButton>
          <PercentageButton
            onClick={() => handlePercentBalanceClick(1)}
            selected={percentageOfBalance === 1}
          >
            <Text color={SemanticColors.primary} variant='body2'>
              Max
            </Text>
          </PercentageButton>
        </Flex>
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
              defaultMessage='You are requesting to withdraw <b>{withdrawalAmountFiat}</b> ({withdrawalAmountCrypto}) from your Staking Account. This balance will be available in your Trading Account after {unbondingDays}. After confirming this withdrawal, you will not continue to earn staking rewards on the amount withdrawn.'
              values={{
                unbondingDays:
                  unbondingDays === 1 ? `${unbondingDays} day` : `${unbondingDays} days`,
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

const enhance = compose(reduxForm<{}, Props>({ form: FORM_NAME, initialValues: { fix: 'CRYPTO' } }))

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
  unbondingDays: number
  walletCurrency: FiatType
}

export default enhance(WithdrawalForm)
