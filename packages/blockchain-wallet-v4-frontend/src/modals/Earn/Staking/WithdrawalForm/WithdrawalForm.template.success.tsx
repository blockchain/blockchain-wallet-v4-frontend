import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
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
import { convertCoinToFiat } from '@core/exchange'
import { fiatToString, formatFiat } from '@core/exchange/utils'
import { CoinType, FiatType } from '@core/types'
import { Button, Icon, SpinningLoader } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import NumberBox from 'components/Form/NumberBox'
import Spacer from 'components/Spacer'
import { selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { InterestWithdrawalFormType } from 'data/components/interest/types'
import { Analytics } from 'data/types'
import { useSardineContext } from 'hooks'
import { required } from 'services/forms'

import CustodialAccount from '../../CustodialAccount'
import { amountToCrypto, amountToFiat } from '../../Earn.utils'
import { OwnProps as ParentProps } from '.'
// import { LinkDispatchPropsType, SuccessStateType } from '.'
// import { maximumWithdrawalAmount, minimumWithdrawalAmount } from './WithdrawalForm.validation'
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

// eslint-disable-next-line
const WithdrawalForm: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const [sardineContextIsReady, sardineContext] = useSardineContext('WITHDRAWAL')
  const {
    // accountBalances,
    // analyticsActions,

    // buySellBalance,
    // coin,
    // displayCoin,
    // earnEDDStatus,
    // earnEDDWithdrawLimits,
    // flagEDDInterestFileUpload,
    // formActions,
    coin,
    handleClose,
    invalid,

    submitting,

    walletCurrency
  } = props

  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const { coinfig } = window.coins[coin]
  const coinTicker = coinfig.displaySymbol
  const displayName = coinfig.name
  const handleSubmitPlaceholder = () => {}
  //   const account = accountBalances[coin]
  //   const accountBalanceBase = account && account.balance
  //   const interestBalanceBase = account && account.totalInterest
  //   const accountBalanceStandard = convertBaseToStandard(coin, accountBalanceBase)
  //   const interestBalanceStandard = convertBaseToStandard(coin, interestBalanceBase)
  //   //   const availToWithdrawCrypto = convertBaseToStandard(coin, availToWithdraw)
  //   const withdrawalAmount = (values && values.withdrawalAmount) || '0'
  //   const availToWithdrawFiat = convertCoinToFiat({
  //     coin,
  //     currency: walletCurrency,
  //     isStandard: true,
  //     rates,
  //     value: availToWithdrawCrypto
  //   })
  //   const withdrawalAmountFiat = amountToFiat(
  //     displayCoin,
  //     withdrawalAmount,
  //     coin,
  //     walletCurrency,
  //     rates
  //   )
  //   const withdrawalAmountCrypto = amountToCrypto(
  //     displayCoin,
  //     withdrawalAmount,
  //     coin,
  //     walletCurrency,
  //     rates
  //   )

  //   const buySellCryptoAmount = Exchange.convertCoinToCoin({
  //     coin,
  //     value: buySellBalance
  //   })

  //   const buySellFiatAmount = Exchange.displayCoinToFiat({
  //     rates,
  //     toCurrency: walletCurrency,
  //     value: buySellCryptoAmount
  //   })

  //   const handleOnClickCryptoAmount = useCallback(() => {
  //     analyticsActions.trackEvent({
  //       key: Analytics.WALLET_REWARDS_WITHDRAW_MAX_AMOUNT_CLICKED,
  //       properties: {
  //         currency: coin
  //       }
  //     })
  //     formActions.change(FORM_NAME, 'withdrawalAmount', availToWithdrawCrypto)
  //   }, [coin])

  //   const handleOnClickFiatAmount = useCallback(() => {
  //     analyticsActions.trackEvent({
  //       key: Analytics.WALLET_REWARDS_WITHDRAW_MAX_AMOUNT_CLICKED,
  //       properties: {
  //         currency: coin
  //       }
  //     })
  //     formActions.touch(FORM_NAME, 'withdrawalAmount')
  //     formActions.change(FORM_NAME, 'withdrawalAmount', availToWithdrawFiat)
  //   }, [coin])

  //   if (!account) return null

  //   const showEDDWithdrawLimit =
  //     (earnEDDWithdrawLimits?.withdrawLimits
  //       ? Number(withdrawalAmountFiat) > Number(earnEDDWithdrawLimits?.withdrawLimits.amount)
  //       : false) &&
  //     !earnEDDStatus?.eddSubmitted &&
  //     !earnEDDStatus?.eddPassed

  //   const handleFormSubmit = (e: React.SyntheticEvent) => {
  //     e.preventDefault()
  //     analyticsActions.trackEvent({
  //       key: Analytics.WALLET_REWARDS_WITHDRAW_TRANSFER_CLICKED,
  //       properties: {
  //         amount: withdrawalAmountCrypto,
  //         amount_usd: withdrawalAmountFiat,
  //         currency: coin,
  //         type: 'TRADING'
  //       }
  //     })
  //     interestActions.requestWithdrawal({
  //       coin,
  //       destination: 'SIMPLEBUY',
  //       formName: FORM_NAME,
  //       origin: 'SAVINGS',
  //       withdrawalAmountCrypto,
  //       withdrawalAmountFiat
  //     })
  //     props.setShowSupply(showEDDWithdrawLimit)
  //     if (sardineContextIsReady) {
  //       sardineContext.updateConfig({
  //         flow: 'WITHDRAWAL'
  //       })
  //     }
  //   }

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
          <CustodialAccount coin={coin} cryptoAmount='1' fiatAmount='1' product='Active Rewards' />
        </Padding>
        <MaxAmountContainer>
          <Text color={SemanticColors.body} variant='paragraph1'>
            <FormattedMessage
              id='modals.interest.withdrawal.accountAmount'
              defaultMessage='Select the account you would like to withdraw your Rewards Account funds to. You can withdraw up to'
            />{' '}
            {/* {displayCoin ? (
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
            )} */}
          </Text>
        </MaxAmountContainer>
        {/* <CustodialAccount
          coin={coin}
          cryptoAmount={buySellCryptoAmount}
          fiatAmount={buySellFiatAmount}
          product='Trading'
        /> */}
        <CustomFormLabel>
          <Text color={SemanticColors.body} variant='paragraph1'>
            <FormattedMessage
              id='modals.interest.withdrawal.enteramount'
              defaultMessage='Enter withdrawal amount'
            />
          </Text>
          {/* <ToggleCoinFiat>
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
          </ToggleCoinFiat> */}
        </CustomFormLabel>
        <AmountFieldContainer>
          {/* <CustomField
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
            }} */}
          {/* /> */}
          {/* <PrincipalCcyAbsolute>
            {displayCoin ? (
              <Text color='grey800' size='14px' weight={600}>
                {coinTicker}
              </Text>
            ) : (
              <Text color='grey800' size='14px' weight={600}>
                {currencySymbol}
              </Text>
            )}
          </PrincipalCcyAbsolute> */}
        </AmountFieldContainer>
        {/* 
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
        )} */}
      </Top>
      <Bottom>
        <NetworkFee>
          <Text color={SemanticColors.body} variant='paragraph1'>
            Withdrawal Text
            {/* <FormattedMessage
              id='modals.interest.withdrawal.recap'
              defaultMessage='You are requesting to withdraw <b>{withdrawalAmountFiat}</b> ({withdrawalAmountCrypto}) from your Rewards Account. After confirming this withdrawal, you will not continue to earn rewards on the amount withdrawn.'
              values={{
                withdrawalAmountCrypto: `${withdrawalAmountCrypto} ${coinTicker}`,
                withdrawalAmountFiat: `${currencySymbol}${formatFiat(withdrawalAmountFiat)}`
              }}
            /> */}
          </Text>
          <Availability>
            <Text color={SemanticColors.body} variant='paragraph1'>
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
            <Text color={SemanticColors.background} variant='paragraph1'>
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

// type LinkStatePropsType = {
//   values?: InterestWithdrawalFormType
// }

type OwnProps = {
  coin: CoinType
  handleClose: () => void
  walletCurrency: FiatType
}

export type Props = OwnProps

// @ts-ignore
const enhance = compose(
  reduxForm<{ form: string }, Props>({ form: FORM_NAME }),
  connect(mapStateToProps)
)

export default enhance(WithdrawalForm) as React.FunctionComponent<Props>
