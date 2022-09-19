import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'

import { CoinType, EarnDepositLimits } from '@core/types'
import {
  Button,
  Icon,
  Link,
  SpinningLoader,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import CheckBox from 'components/Form/CheckBox'
import CoinBalanceDropdown from 'components/Form/CoinBalanceDropdown'
import NumberBox from 'components/Form/NumberBox'
import { actions, selectors } from 'data'
import { RewardsDepositFormType } from 'data/components/interest/types'
import { RootState } from 'data/rootReducer'
import { Analytics, SwapBaseCounterTypes } from 'data/types'
import { required } from 'services/forms'
import { debounce } from 'utils/helpers'

import { amountToFiat } from '../conversions'
import { CurrencySuccessStateType, DataSuccessStateType, OwnProps as ParentOwnProps } from '.'
import {
  AgreementContainer,
  AmountError,
  AmountFieldContainer,
  ButtonContainer,
  CustomField,
  CustomForm,
  CustomFormLabel,
  CustomOrangeCartridge,
  ErrorText,
  FiatMaxContainer,
  FORM_NAME,
  GreyBlueCartridge,
  InfoText,
  PrincipalCcyAbsolute,
  SendingWrapper,
  TermsContainer,
  TopText
} from './DepositForm.model'
import { maxDepositAmount, minDepositAmount } from './DepositForm.validation'

const checkIsAmountUnderDepositLimit = (
  depositLimits: EarnDepositLimits,
  coin: CoinType,
  depositAmount: string
): boolean => {
  const { earnDepositLimits } = depositLimits

  if (!earnDepositLimits || earnDepositLimits.length === 0) {
    return false
  }

  const coinLimit = earnDepositLimits.find((dep) => dep.savingsCurrency === coin)?.amount || 0
  // compare entered amount with deposit limit for current coin
  return Number(depositAmount) > coinLimit
}

const DepositForm: React.FC<InjectedFormProps<{ form: string }, Props> & Props> = (props) => {
  const {
    analyticsActions,
    coin,
    earnActions,
    earnDepositLimits,
    formActions,
    formErrors,
    interestAccount,
    interestEDDDepositLimits,
    interestEDDStatus,
    interestRates,
    invalid,
    payment,
    rates,
    setShowSupply,
    submitting,
    values,
    walletCurrency
  } = props
  const { coinfig } = window.coins[coin]

  const depositAmount = (values && values.depositAmount) || '0'

  const depositAmountFiat = amountToFiat(true, depositAmount, coin, walletCurrency, rates)

  const fromAccountType =
    interestAccount?.type === SwapBaseCounterTypes.CUSTODIAL ? 'TRADING' : 'USERKEY'

  const depositAmountError =
    formErrors.depositAmount &&
    typeof formErrors.depositAmount === 'string' &&
    formErrors.depositAmount
  const isErc20 = !!window.coins[coin].coinfig.type.erc20Address
  const insufficientEth =
    payment &&
    isErc20 &&
    !!window.coins[coin].coinfig.type.erc20Address &&
    // @ts-ignore
    !payment.isSufficientEthForErc20

  const showEDDDepositLimit =
    checkIsAmountUnderDepositLimit(interestEDDDepositLimits, coin, depositAmountFiat) &&
    !interestEDDStatus?.eddSubmitted &&
    !interestEDDStatus?.eddPassed

  const handleFormSubmit = () => {
    earnActions.submitDepositForm({ formName: FORM_NAME })
    // setShowSupply(showEDDDepositLimit)

    analyticsActions.trackEvent({
      key: Analytics.WALLET_STAKING_DEPOSIT_TRANSFER_CLICKED,
      properties: {
        amount: depositAmount,
        amount_usd: depositAmountFiat,
        currency: coin,
        type: fromAccountType
      }
    })
  }

  const amountChanged = (e) => {
    analyticsActions.trackEvent({
      key: Analytics.STAKING_CLIENT_DEPOSIT_AMOUNT_ENTERED,
      properties: {
        amount: Number(e.target.value),
        amount_currency: coin,
        currency: walletCurrency,
        from_account_type: fromAccountType,
        input_amount: Number(values.depositAmount),
        interest_rate: Number(interestRates[coin]),
        output_amount: Number
      }
    })
  }

  if (submitting) {
    return (
      <SendingWrapper>
        <SpinningLoader />
        <Text weight={600} color='grey800' size='20px' style={{ marginTop: '24px' }}>
          <FormattedMessage
            id='modals.interest.deposit.sendingtitle'
            defaultMessage='In Progress...'
          />
        </Text>
        <Text weight={600} color='grey600' size='16px' style={{ marginTop: '24px' }}>
          <FormattedMessage
            id='modals.staking.deposit.sendingsubtitle'
            defaultMessage='Sending {displayName} to your Staking Account'
            values={{ displayName: coinfig.displaySymbol }}
          />
        </Text>
      </SendingWrapper>
    )
  }

  return (
    <CustomForm onSubmit={handleFormSubmit}>
      <FlyoutWrapper style={{ paddingBottom: '0' }}>
        <TopText color='grey800' size='20px' weight={600}>
          <FormattedMessage
            id='modals.staking.title'
            defaultMessage='Stake {coin}'
            values={{ coin }}
          />
        </TopText>
        <InfoText>
          <Text
            color='grey600'
            weight={500}
            size='14px'
            style={{ lineHeight: '1.5', margin: '18px 0 8px 0' }}
          >
            {!insufficientEth && (
              <>
                <FormattedMessage
                  id='modals.interest.deposit.youcantransfer'
                  defaultMessage='You can transfer up to'
                  values={{
                    coin
                  }}
                />{' '}
                <FiatMaxContainer
                  onClick={() =>
                    formActions.change(FORM_NAME, 'depositAmount', earnDepositLimits.maxCoin)
                  }
                >
                  <Text color='blue600' size='14px' weight={500}>
                    {earnDepositLimits.maxCoin}{' '}
                  </Text>
                </FiatMaxContainer>{' '}
                <FormattedMessage
                  id='modals.interest.deposit.uptoamount2'
                  defaultMessage='of {coin} from this wallet.'
                  values={{
                    coin: coinfig.displaySymbol
                  }}
                />
                <TooltipHost id='modals.interest.depositmax.tooltip'>
                  <TooltipIcon name='info' size='12px' />
                </TooltipHost>
              </>
            )}
          </Text>
        </InfoText>
        {isErc20 && insufficientEth && (
          <ErrorText>
            <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
            <FormattedMessage
              id='modals.interest.deposit.notenougheth'
              defaultMessage='ETH is required to send {coinTicker}. You do not have enough ETH to perform a transaction.'
              values={{ coinTicker: coin }}
            />
          </ErrorText>
        )}
        <CoinBalanceDropdown
          {...props}
          fiatCurrency={walletCurrency}
          includeCustodial
          // includeInterest
          name='earnDepositAccount'
        />
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.deposit.transferamount'
              defaultMessage='Enter transfer amount'
            />{' '}
          </Text>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            coin={coin}
            component={NumberBox}
            data-e2e='depositAmount'
            // @ts-ignore
            disabled={insufficientEth}
            name='depositAmount'
            validate={[required, minDepositAmount, maxDepositAmount]}
            {...{
              errorBottom: true,
              errorLeft: true
            }}
            onChange={debounce((event) => {
              amountChanged(event)
            }, 500)}
          />
          <PrincipalCcyAbsolute>
            <Text color='grey800' size='14px' weight={600}>
              {coinfig.displaySymbol}
            </Text>
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
        {depositAmountError && (
          <AmountError>
            {depositAmountError === 'ABOVE_MAX' ? (
              <>
                <Text size='14px' weight={500} color='red600'>
                  <FormattedMessage
                    id='modals.interest.deposit.maxtransfer'
                    defaultMessage='Maximum transfer: {maxFiat}'
                    values={{
                      maxFiat: earnDepositLimits.maxCoin
                    }}
                  />
                </Text>
                <GreyBlueCartridge
                  data-e2e='interestMax'
                  role='button'
                  onClick={() => {
                    earnActions.handleTransferMaxAmountClick({
                      amount: earnDepositLimits.maxCoin,
                      formName: FORM_NAME
                    })

                    analyticsActions.trackEvent({
                      key: Analytics.STAKING_CLIENT_DEPOSIT_MAX_AMOUNT_CLICKED,
                      properties: {
                        amount_currency: coin,
                        currency: walletCurrency,
                        from_account_type: fromAccountType
                      }
                    })
                  }}
                >
                  <FormattedMessage
                    id='modals.interest.deposit.maxtransfer.button'
                    defaultMessage='Transfer Max'
                  />
                </GreyBlueCartridge>
              </>
            ) : (
              <>
                <Text size='14px' weight={500} color='red600'>
                  <FormattedMessage
                    id='modals.staking.deposit.mintransfer'
                    defaultMessage='Minimum required: {minFiat} {walletCurrency} ({minCoin} {coin})'
                    values={{
                      coin,
                      minCoin: earnDepositLimits.minCoin,
                      minFiat: earnDepositLimits.minFiat,
                      walletCurrency
                    }}
                  />
                </Text>
                <GreyBlueCartridge
                  data-e2e='interestMin'
                  role='button'
                  onClick={() =>
                    earnActions.handleTransferMinAmountClick({
                      amount: earnDepositLimits.minCoin,
                      formName: FORM_NAME
                    })
                  }
                >
                  <FormattedMessage
                    id='modals.interest.deposit.mintransfer.button'
                    defaultMessage='Transfer Min'
                  />
                </GreyBlueCartridge>
              </>
            )}
          </AmountError>
        )}
        {showEDDDepositLimit && (
          <CustomOrangeCartridge>
            <Icon name='info' color='orange600' size='18px' style={{ marginRight: '12px' }} />
            <FormattedMessage
              id='modals.interest.deposit.edd_need'
              defaultMessage="Transferring this amount requires further verification. We'll ask you for those details in the next step."
            />
          </CustomOrangeCartridge>
        )}
      </FlyoutWrapper>
      <FlyoutWrapper
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'flex-end'
        }}
      >
        <Field component={CheckBox} hideErrors name='terms' validate={[required]}>
          <TermsContainer>
            <Text lineHeight='1.4' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.deposit.termsread'
                defaultMessage='I have read and agreed to the'
              />
            </Text>{' '}
            <Link href='https://www.blockchain.com/legal' target='_blank' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.deposit.termsservice'
                defaultMessage='Terms of Service'
              />
            </Link>{' '}
            <Text lineHeight='1.4' size='14px' weight={500}>
              &
            </Text>{' '}
            <Link
              href='https://www.blockchain.com/legal/privacy'
              target='_blank'
              size='14px'
              weight={500}
            >
              <FormattedMessage id='modals.interest.deposit.privacy' defaultMessage='Privacy' />
            </Link>
            .
          </TermsContainer>
        </Field>
        <Field component={CheckBox} hideErrors name='agreement' validate={[required]}>
          <AgreementContainer>
            <Text lineHeight='1.4' size='14px' weight={500}>
              <FormattedMessage
                id='modals.staking.deposit.agreement2'
                defaultMessage='I agree to transfer ETH to my Staking Account. I understand that I can’t unstake until withdrawals are enabled on Ethereum and funds are subject to a bonding period before generating rewards.'
              />
            </Text>
          </AgreementContainer>
        </Field>
        <ButtonContainer>
          <Button
            data-e2e='interestDepositSubmit'
            disabled={invalid || insufficientEth}
            fullwidth
            height='48px'
            nature='primary'
            type='submit'
          >
            <Text size='16px' weight={600} color='white'>
              <FormattedMessage
                id='modals.interest.deposit.confirmtransfer'
                defaultMessage='Confirm Transfer'
              />
            </Text>
          </Button>
        </ButtonContainer>
      </FlyoutWrapper>
    </CustomForm>
  )
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  values: selectors.form.getFormValues(FORM_NAME)(state) as RewardsDepositFormType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  earnActions: bindActionCreators(actions.components.interest, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  values?: RewardsDepositFormType
}

export type Props = DataSuccessStateType &
  CurrencySuccessStateType &
  ConnectedProps<typeof connector> &
  ParentOwnProps &
  FormProps

type FormProps = {
  onSubmit: () => void
}

const enhance = compose(
  reduxForm<{ form: string }, Props>({ destroyOnUnmount: false, form: FORM_NAME }),
  connector
)

export default enhance(DepositForm) as React.FunctionComponent<Props>
