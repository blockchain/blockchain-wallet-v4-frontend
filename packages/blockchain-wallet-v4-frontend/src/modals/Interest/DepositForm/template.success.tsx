import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React from 'react'

import { actions, selectors } from 'data'
import {
  Button,
  Link,
  SpinningLoader,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'

import { CheckBox, CoinBalanceDropdown, NumberBox } from 'components/Form'
import { Exchange } from 'core'
import {
  fiatToString,
  formatFiat
} from 'blockchain-wallet-v4/src/exchange/currency'
import { InterestDepositFormType } from 'data/components/interest/types'
import { required } from 'services/FormHelper'

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
  FiatMaxContainer,
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
import {
  amountToCrypto,
  amountToFiat,
  calcCompoundInterest,
  maxFiat
} from '../conversions'
import { maxDepositAmount, minDepositAmount } from './validation'
import { SuccessStateType } from '.'
import TabMenuTimeFrame from './TabMenuTimeFrame'

const FORM_NAME = 'interestDepositForm'

const DepositForm: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const {
    coin,
    depositLimits,
    displayCoin,
    formActions,
    formErrors,
    handleDisplayToggle,
    interestActions,
    interestLimits,
    interestRate,
    invalid,
    rates,
    submitting,
    supportedCoins,
    walletCurrency,
    values
  } = props
  const { coinTicker, displayName } = supportedCoins[coin]

  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const depositAmount = (values && values.depositAmount) || '0'

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
  const lockupPeriod = interestLimits[coin].lockUpDuration / 86400
  const maxDepositFiat = maxFiat(depositLimits.maxFiat, walletCurrency)

  const amtError =
    formErrors.depositAmount &&
    typeof formErrors.depositAmount === 'string' &&
    formErrors.depositAmount
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
  ) : (
    <CustomForm onSubmit={props.handleSubmit}>
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
            id='modals.interest.deposit.title'
            defaultMessage='Deposit {displayName}'
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
              id='modals.interest.deposit.subheader'
              defaultMessage='Deposit {displayName} to your Interest Account and earn up to {rate}% interest annually on your crypto. You can deposit up to'
              values={{
                displayName,
                rate: interestRate[coin]
              }}
            />{' '}
            <FiatMaxContainer
              onClick={() =>
                formActions.change(
                  FORM_NAME,
                  'depositAmount',
                  displayCoin ? depositLimits.maxCoin : depositLimits.maxFiat
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
          </Text>
        </InfoText>
        <CoinBalanceDropdown
          {...props}
          fiatCurrency={walletCurrency}
          name='interestDepositAccount'
        />
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.deposit.amount'
              defaultMessage='Enter deposit amount'
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
        {amtError && (
          <AmountError>
            <Text size='14px' weight={500} color='red600'>
              {amtError === 'ABOVE_MAX' ? (
                <FormattedMessage
                  id='modals.interest.deposit.max'
                  defaultMessage='Maximum deposit: {maxFiat}'
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
                  id='modals.interest.deposit.min'
                  defaultMessage='Minimum deposit: {minFiat}'
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
                amtError === 'ABOVE_MAX'
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
              {amtError === 'ABOVE_MAX' ? (
                <FormattedMessage
                  id='modals.interest.deposit.max.button'
                  defaultMessage='Deposit Max'
                />
              ) : (
                <FormattedMessage
                  id='modals.interest.deposit.min.button'
                  defaultMessage='Deposit Min'
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
              {'&'}
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
            {'.'}
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
              <FormattedMessage
                id='modals.interest.deposit.agreement1'
                defaultMessage='By accepting this, you agree to transfer {depositAmountFiat} ({depositAmountCrypto}) plus network fees from your {displayName} Wallet to your Interest Account. An initial hold period of {lockupPeriod} days will be applied to your funds.'
                values={{
                  lockupPeriod,
                  depositAmountFiat: `${currencySymbol}${formatFiat(
                    depositAmountFiat
                  )}`,
                  depositAmountCrypto: `${depositAmountCrypto} ${coinTicker}`,
                  displayName
                }}
              />
            </Text>
          </AgreementContainer>
        </Field>
        <ButtonContainer>
          <Button
            data-e2e='interestDepositSubmit'
            disabled={invalid}
            fullwidth
            height='48px'
            nature='primary'
            type='submit'
          >
            <Text size='16px' weight={600} color='white'>
              <FormattedMessage
                id='modals.interest.deposit.confirm'
                defaultMessage='Confirm Deposit'
              />
            </Text>
          </Button>
        </ButtonContainer>
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = (state): LinkStatePropsType => ({
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

export type Props = SuccessStateType &
  ConnectedProps<typeof connector> &
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
