import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'

import {
  Button,
  Icon,
  Link,
  SpinningLoader,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'
import {
  fiatToString,
  formatFiat
} from 'blockchain-wallet-v4/src/exchange/currency'
import { CheckBox, CoinBalanceDropdown, NumberBox } from 'components/Form'
import { actions, selectors } from 'data'
import { InterestDepositFormType } from 'data/components/interest/types'
import { RootState } from 'data/rootReducer'
import { required } from 'services/forms'

import {
  amountToCrypto,
  amountToFiat,
  calcCompoundInterest,
  maxFiat
} from '../conversions'
import {
  CurrencySuccessStateType,
  DataSuccessStateType,
  OwnProps as ParentOwnProps
} from '.'
import {
  AgreementContainer,
  AmountError,
  AmountFieldContainer,
  ArrowIcon,
  Bottom,
  ButtonContainer,
  CalculatorContainer,
  CalculatorDesc,
  CalculatorHeaderContainer,
  CalculatorWrapper,
  CustomField,
  CustomForm,
  CustomFormLabel,
  ErrorText,
  FiatMaxContainer,
  FORM_NAME,
  GreyBlueCartridge,
  InfoText,
  InterestTermContainer,
  InterestTermWrapper,
  PrincipalCcyAbsolute,
  SendingWrapper,
  TermsContainer,
  ToggleCoinFiat,
  ToggleCoinText,
  ToggleFiatText,
  Top,
  TopText
} from './model'
import TabMenuTimeFrame from './TabMenuTimeFrame'
import { maxDepositAmount, minDepositAmount } from './validation'

const DepositForm: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const {
    coin,
    depositLimits,
    displayCoin,
    feeCrypto,
    feeFiat,
    formActions,
    formErrors,
    handleDisplayToggle,
    handleSubmit,
    interestActions,
    interestLimits,
    interestRate,
    invalid,
    payment,
    rates,
    submitting,
    supportedCoins,
    values,
    walletCurrency
  } = props
  const { coinTicker, displayName } = supportedCoins[coin]

  if (submitting) {
    return (
      <SendingWrapper>
        <SpinningLoader />
        <Text
          weight={600}
          color='grey800'
          size='20px'
          style={{ marginTop: '24px' }}
        >
          <FormattedMessage
            id='modals.interest.deposit.sendingtitle'
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
            id='modals.interest.deposit.sendingsubtitle'
            defaultMessage='Sending {displayName} to your Interest Account'
            values={{ displayName }}
          />
        </Text>
      </SendingWrapper>
    )
  }

  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const depositAmount = (values && values.depositAmount) || '0'
  const isCustodial =
    values &&
    values?.interestDepositAccount &&
    values.interestDepositAccount.type === 'CUSTODIAL'

  const depositAmountFiat = amountToFiat(
    displayCoin,
    depositAmount,
    coin,
    walletCurrency,
    rates
  )
  const depositAmountCrypto = amountToCrypto(
    displayCoin,
    depositAmount,
    coin,
    walletCurrency,
    rates
  )

  const loanTimeFrame = values && values.loanTimeFrame

  const lockUpDuration = interestLimits[coin]?.lockUpDuration || 7200
  const lockupPeriod = lockUpDuration / 86400
  const maxDepositFiat = maxFiat(depositLimits.maxFiat, walletCurrency)

  const depositAmountError =
    formErrors.depositAmount &&
    typeof formErrors.depositAmount === 'string' &&
    formErrors.depositAmount
  const isErc20 = !!supportedCoins[coin].contractAddress
  const insufficientEth =
    payment &&
    !!supportedCoins[coin]?.contractAddress &&
    !!supportedCoins[payment.coin]?.contractAddress &&
    // @ts-ignore
    !payment.isSufficientEthForErc20

  return (
    <CustomForm onSubmit={handleSubmit}>
      <Top>
        <TopText color='grey800' size='20px' weight={600}>
          <ArrowIcon
            onClick={() => interestActions.setInterestStep('ACCOUNT_SUMMARY')}
            cursor
            role='button'
            name='arrow-left'
            size='20px'
            color='grey600'
          />
          <FormattedMessage
            id='modals.interest.deposit.title_transfer'
            defaultMessage='Transfer {displayName}'
            values={{ displayName }}
          />
        </TopText>
        <InfoText>
          <Text
            color='grey600'
            weight={500}
            size='14px'
            style={{ margin: '18px 0 8px 0', lineHeight: '1.5' }}
          >
            <FormattedMessage
              id='modals.interest.deposit.subheader_transfer'
              defaultMessage='Transfer {displayName} to your Interest Account and earn up to {rate}% interest annually on your crypto.'
              values={{
                displayName,
                rate: interestRate[coin]
              }}
            />{' '}
            {!insufficientEth && (
              <>
                <FormattedMessage
                  id='modals.interest.deposit.youcantransfer'
                  defaultMessage='You can transfer up to'
                  values={{
                    coin: coinTicker
                  }}
                />{' '}
                <FiatMaxContainer
                  onClick={() =>
                    formActions.change(
                      FORM_NAME,
                      'depositAmount',
                      displayCoin
                        ? depositLimits.maxCoin
                        : depositLimits.maxFiat
                    )
                  }
                >
                  {displayCoin ? (
                    <Text color='blue600' size='14px' weight={500}>
                      {depositLimits.maxCoin}{' '}
                    </Text>
                  ) : (
                    <Text color='blue600' size='14px' weight={500}>
                      {maxDepositFiat}{' '}
                    </Text>
                  )}
                </FiatMaxContainer>{' '}
                <FormattedMessage
                  id='modals.interest.deposit.uptoamount2'
                  defaultMessage='of {coin} from this wallet.'
                  values={{
                    coin: coinTicker
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
            <Icon
              name='alert-filled'
              color='red600'
              style={{ marginRight: '4px' }}
            />
            <FormattedMessage
              id='modals.interest.deposit.notenougheth'
              defaultMessage='ETH is required to send {coinTicker}. You do not have enough ETH to perform a transaction.'
              values={{ coinTicker }}
            />
          </ErrorText>
        )}
        <CoinBalanceDropdown
          {...props}
          includeCustodial
          fiatCurrency={walletCurrency}
          name='interestDepositAccount'
        />
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.deposit.transferamount'
              defaultMessage='Enter transfer amount'
            />{' '}
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
            data-e2e='depositAmount'
            // @ts-ignore
            disabled={insufficientEth}
            displayCoin={displayCoin}
            name='depositAmount'
            validate={[required, minDepositAmount, maxDepositAmount]}
            {...{
              errorBottom: true,
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
        {depositAmountError && (
          <AmountError>
            <Text size='14px' weight={500} color='red600'>
              {depositAmountError === 'ABOVE_MAX' ? (
                <FormattedMessage
                  id='modals.interest.deposit.maxtransfer'
                  defaultMessage='Maximum transfer: {maxFiat}'
                  values={{
                    maxFiat: displayCoin
                      ? depositLimits.maxCoin
                      : fiatToString({
                          value: depositLimits.maxFiat,
                          unit: walletCurrency
                        })
                  }}
                />
              ) : (
                <FormattedMessage
                  id='modals.interest.deposit.mintransfer'
                  defaultMessage='Minimum transfer: {minFiat}'
                  values={{
                    minFiat: displayCoin
                      ? depositLimits.minCoin
                      : fiatToString({
                          value: depositLimits.minFiat,
                          unit: walletCurrency
                        })
                  }}
                />
              )}
            </Text>
            <GreyBlueCartridge
              data-e2e='interestBuyMinMaxBtn'
              role='button'
              onClick={() => {
                depositAmountError === 'ABOVE_MAX'
                  ? formActions.change(
                      FORM_NAME,
                      'depositAmount',
                      displayCoin
                        ? depositLimits.maxCoin
                        : depositLimits.maxFiat
                    )
                  : formActions.change(
                      FORM_NAME,
                      'depositAmount',
                      displayCoin
                        ? depositLimits.minCoin
                        : depositLimits.minFiat
                    )
              }}
            >
              {depositAmountError === 'ABOVE_MAX' ? (
                <FormattedMessage
                  id='modals.interest.deposit.maxtransfer.button'
                  defaultMessage='Transfer Max'
                />
              ) : (
                <FormattedMessage
                  id='modals.interest.deposit.mintransfer.button'
                  defaultMessage='Transfer Min'
                />
              )}
            </GreyBlueCartridge>
          </AmountError>
        )}
        <CalculatorWrapper>
          <CalculatorHeaderContainer>
            <Text color='grey800' weight={600}>
              <FormattedMessage
                id='modals.interest.deposit.calc'
                defaultMessage='Interest Calculator'
              />
            </Text>
            <TooltipHost id='modals.interest.calculator.tooltip'>
              <TooltipIcon name='info' size='14px' />
            </TooltipHost>
          </CalculatorHeaderContainer>
          <CalculatorDesc color='grey600' size='12px' weight={500}>
            {displayCoin ? (
              <FormattedMessage
                id='modals.interest.deposit.calcdesccoin'
                defaultMessage='With {depositAmount} {coinTicker} in your Interest Account you can earn:'
                values={{ depositAmount, coinTicker }}
              />
            ) : (
              <FormattedMessage
                id='modals.interest.deposit.calcdesc'
                defaultMessage='With {currencySymbol} {depositAmountFiat} in your Interest Account you can earn:'
                values={{
                  currencySymbol,
                  depositAmountFiat: formatFiat(depositAmountFiat)
                }}
              />
            )}
          </CalculatorDesc>
          <CalculatorContainer>
            <Field component={TabMenuTimeFrame} name='loanTimeFrame' />
            <InterestTermWrapper>
              {loanTimeFrame === 'short' ? (
                <>
                  <InterestTermContainer>
                    <Text color='grey600' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.interest.deposit.daily'
                        defaultMessage='Daily'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      {currencySymbol}
                      {calcCompoundInterest(
                        depositAmountFiat,
                        interestRate[coin],
                        1 / 365
                      )}
                    </Text>
                  </InterestTermContainer>
                  <InterestTermContainer>
                    <Text color='grey600' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.interest.deposit.weekly'
                        defaultMessage='Weekly'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      {currencySymbol}
                      {calcCompoundInterest(
                        depositAmountFiat,
                        interestRate[coin],
                        1 / 52
                      )}
                    </Text>
                  </InterestTermContainer>
                  <InterestTermContainer>
                    <Text color='grey600' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.interest.deposit.monthly'
                        defaultMessage='Monthly'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      {currencySymbol}
                      {calcCompoundInterest(
                        depositAmountFiat,
                        interestRate[coin],
                        1 / 12
                      )}
                    </Text>
                  </InterestTermContainer>
                </>
              ) : (
                <>
                  <InterestTermContainer>
                    <Text color='grey600' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.interest.deposit.year'
                        defaultMessage='1 Year'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      {currencySymbol}
                      {calcCompoundInterest(
                        depositAmountFiat,
                        interestRate[coin],
                        1
                      )}
                    </Text>
                  </InterestTermContainer>
                  <InterestTermContainer>
                    <Text color='grey600' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.interest.deposit.threeyear'
                        defaultMessage='3 Years'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      {currencySymbol}
                      {calcCompoundInterest(
                        depositAmountFiat,
                        interestRate[coin],
                        3
                      )}
                    </Text>
                  </InterestTermContainer>
                  <InterestTermContainer>
                    <Text color='grey600' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.interest.deposit.fiveyears'
                        defaultMessage='5 Years'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      {currencySymbol}
                      {calcCompoundInterest(
                        depositAmountFiat,
                        interestRate[coin],
                        5
                      )}
                    </Text>
                  </InterestTermContainer>
                </>
              )}
            </InterestTermWrapper>
            <Text size='11px' weight={400} style={{ marginTop: '6px' }}>
              <FormattedMessage
                id='modals.interest.deposit.calcrate'
                defaultMessage='Estimates based on current interest rate and {coinTicker} price.'
                values={{ coinTicker }}
              />
            </Text>
          </CalculatorContainer>
        </CalculatorWrapper>
      </Top>
      <Bottom>
        <Field
          component={CheckBox}
          hideErrors
          name='terms'
          validate={[required]}
        >
          <TermsContainer>
            <Text lineHeight='1.4' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.deposit.termsread'
                defaultMessage='I have read and agreed to the'
              />
            </Text>{' '}
            <Link
              href='https://www.blockchain.com/legal/borrow-terms'
              target='_blank'
              size='14px'
              weight={500}
            >
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
              <FormattedMessage
                id='modals.interest.deposit.privacy'
                defaultMessage='Privacy'
              />
            </Link>
            .
          </TermsContainer>
        </Field>
        <Field
          component={CheckBox}
          hideErrors
          name='agreement'
          validate={[required]}
        >
          <AgreementContainer>
            <Text lineHeight='1.4' size='14px' weight={500}>
              {isCustodial ? (
                <FormattedMessage
                  id='modals.interest.deposit.agreement.custodial1'
                  defaultMessage='By accepting this, you agree to transfer {depositAmountFiat} ({depositAmountCrypto}) from your {displayName} Trading Account to your Interest Account. An initial hold period of {lockupPeriod} days will be applied to your funds.'
                  values={{
                    lockupPeriod,
                    depositAmountFiat: `${currencySymbol}${formatFiat(
                      depositAmountFiat
                    )}`,
                    depositAmountCrypto: `${depositAmountCrypto} ${coinTicker}`,
                    displayName
                  }}
                />
              ) : (
                <FormattedMessage
                  id='modals.interest.deposit.agreement2'
                  defaultMessage='By accepting this, you agree to transfer {depositAmountFiat} ({depositAmountCrypto}) plus a network fee of ~{depositFeeFiat} ({depositFeeCrypto}) from your {displayName} Wallet to your Interest Account. An initial hold period of {lockupPeriod} days will be applied to your funds.'
                  values={{
                    lockupPeriod,
                    depositAmountFiat: `${currencySymbol}${formatFiat(
                      depositAmountFiat
                    )}`,
                    depositAmountCrypto: `${depositAmountCrypto} ${coinTicker}`,
                    depositFeeFiat: `${currencySymbol}${formatFiat(
                      Number(feeFiat)
                    )}`,
                    depositFeeCrypto: isErc20
                      ? `${feeCrypto} ETH`
                      : `${feeCrypto} ${coinTicker}`,
                    displayName
                  }}
                />
              )}
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
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  values: selectors.form.getFormValues(FORM_NAME)(
    state
  ) as InterestDepositFormType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  values?: InterestDepositFormType
}

export type Props = DataSuccessStateType &
  CurrencySuccessStateType &
  ConnectedProps<typeof connector> &
  ParentOwnProps &
  FormProps

type FormProps = {
  handleDisplayToggle: (boolean) => void
  onSubmit: () => void
}

const enhance = compose(
  reduxForm<{}, Props>({ form: FORM_NAME, destroyOnUnmount: false }),
  connector
)

export default enhance(DepositForm) as React.FunctionComponent<Props>
