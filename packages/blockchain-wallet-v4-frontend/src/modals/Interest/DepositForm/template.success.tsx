import { BaseFieldProps, Field, InjectedFormProps, reduxForm } from 'redux-form'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import {
  Button,
  Icon,
  Link,
  SpinningLoader,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { CustomCartridge } from 'components/Cartridge'

import {
  CheckBox,
  CoinBalanceDropdown,
  Form,
  FormLabel,
  NumberBox
} from 'components/Form'
import { Exchange } from 'core'
import {
  fiatToString,
  formatFiat
} from 'blockchain-wallet-v4/src/exchange/currency'
import { FlyoutWrapper } from 'components/Flyout'
import { InterestDepositFormType } from 'data/components/interest/types'
import { required } from 'services/FormHelper'

import { maxDepositAmount, minDepositAmount } from './validation'
import { SuccessStateType } from '.'
import TabMenuTimeFrame from './TabMenuTimeFrame'

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
const TopText = styled(Text)`
  display: flex;
  width: 100%;
  align-items: center;
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
`
const CustomField = styled(Field)<BaseFieldProps>`
  > input {
    padding-left: 42px;
  }
  > div:last-child {
    display: none;
  }
`
const AmountFieldContainer = styled.div`
  display: flex;
  position: relative;
`
const PrincipalCcyAbsolute = styled.div`
  position: absolute;
  top: 16px;
  left: 12px;
`

const MaxAmountContainer = styled.div`
  align-items: center;
  display: flex;
  margin: 10px 0;
`
const FiatMaxContainer = styled.div`
  cursor: pointer;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  background-color: ${props => props.theme.grey000};
`
const CalculatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 28px;
`
const CalculatorHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const CalculatorDesc = styled(Text)`
  margin: 6px 0 8px;
`
const CalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  background-color: ${props => props.theme.greyFade000};
  border: 1px solid ${({ theme }) => theme.grey000};
  box-sizing: border-box;
  border-radius: 8px;
`

const AmountError = styled.div`
  margin: 10px 5px 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const GreyBlueCartridge = styled(CustomCartridge)`
  background-color: ${props => props.theme.white};
  border: 1px solid ${props => props.theme.grey100};
  color: ${props => props.theme.blue600};
  cursor: pointer;
  margin-left: 10px;
`
const InterestTermWrapper = styled.div`
  display: flex;
`
const InterestTermContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-right: 1px solid ${({ theme }) => theme.grey000};
  margin-right: 16px;
  width: 114px;
  height: 48px;

  &:last-child {
    border-right: 1px solid transparent;
    margin-right: 0;
  }
`
const TermsContainer = styled.div`
  margin: -3px 0 24px 0;

  & > * {
    display: inline-block;
  }
`
const AgreementContainer = styled.div`
  margin-top: -3px;

  & > * {
    display: inline-block;
  }
`
const ArrowIcon = styled(Icon)`
  margin-right: 20px;
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  > button {
    padding: 15px !important;
  }
`

const calcCompoundInterest = (principal, rate, term) => {
  const COMPOUNDS_PER_YEAR = 365
  const principalInt = parseFloat(principal)
  if (!principalInt) return '0.00'
  const totalAmount =
    principalInt *
    Math.pow(1 + rate / (COMPOUNDS_PER_YEAR * 100), COMPOUNDS_PER_YEAR * term)
  return formatFiat(totalAmount - principalInt)
}

const FORM_NAME = 'interestDepositForm'

const DepositForm: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const {
    coin,
    depositLimits,
    formActions,
    formErrors,
    interestActions,
    interestLimits,
    interestRate,
    invalid,
    walletCurrency,
    rates,
    submitting,
    supportedCoins,
    values
  } = props
  const { coinTicker, displayName } = supportedCoins[coin]

  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const depositAmount = (values && values.depositAmount) || '0'
  const depositAmountFiat = formatFiat(depositAmount)
  const depositAmountCrypto = Exchange.convertCoinToCoin({
    baseToStandard: true,
    coin,
    value: Exchange.convertFiatToBtc({
      fromCurrency: walletCurrency,
      toUnit: 'SAT',
      rates,
      value: depositAmount
    }).value
  }).value
  const loanTimeFrame = values && values.loanTimeFrame
  const lockupPeriod = interestLimits[coin].lockUpDuration / 86400

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
        <Text
          color='grey600'
          weight={500}
          size='14px'
          style={{ marginTop: '24px' }}
        >
          <FormattedMessage
            id='modals.interest.deposit.subheader'
            defaultMessage='Deposit {displayName} to your Interest Account and earn up to {rate}% interest annually on your crypto.'
            values={{
              displayName,
              rate: interestRate[coin]
            }}
          />
        </Text>
        <MaxAmountContainer>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.deposit.uptoamount1'
              defaultMessage='You can deposit up to'
            />{' '}
            <FiatMaxContainer
              onClick={() =>
                formActions.change(
                  FORM_NAME,
                  'depositAmount',
                  depositLimits.maxFiat
                )
              }
            >
              <Text color='blue600' size='14px' weight={500}>
                {fiatToString({
                  value: depositLimits.maxFiat,
                  unit: walletCurrency
                })}{' '}
              </Text>
            </FiatMaxContainer>
            <FormattedMessage
              id='modals.interest.deposit.uptoamount2'
              defaultMessage='of {coin} from this wallet.'
              values={{
                coin
              }}
            />
          </Text>
          <TooltipHost id='modals.interest.depositmax.tooltip'>
            <TooltipIcon name='info' size='12px' />
          </TooltipHost>
        </MaxAmountContainer>

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
            />
          </Text>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            component={NumberBox}
            data-e2e='depositAmount'
            name='depositAmount'
            validate={[required, minDepositAmount, maxDepositAmount]}
            {...{
              autoFocus: true,
              errorBottom: true,
              errorLeft: true
            }}
          />
          <PrincipalCcyAbsolute>
            <Text color='grey800' size='14px' weight={600}>
              {currencySymbol}
            </Text>
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
        {amtError && (
          <AmountError>
            <Text size='14px' weight={500} color='red600'>
              {amtError === 'ABOVE_MAX' ? (
                <FormattedMessage
                  id='modals.interest.deposit.max'
                  defaultMessage='You cannot deposit more than {maxFiat}'
                  values={{
                    maxFiat: fiatToString({
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
                    minFiat: fiatToString({
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
                      depositLimits.maxFiat
                    )
                  : formActions.change(
                      FORM_NAME,
                      'depositAmount',
                      depositLimits.minFiat
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
            <FormattedMessage
              id='modals.interest.deposit.calcdesc'
              defaultMessage='With {currencySymbol}{depositAmountFiat} in your Interest Account you can earn:'
              values={{ currencySymbol, depositAmountFiat }}
            />
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
                        depositAmount,
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
                        depositAmount,
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
                        depositAmount,
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
                        depositAmount,
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
                        depositAmount,
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
                        depositAmount,
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
                id='modals.interest.deposit.calcfooter'
                defaultMessage='Estimates based on current interest rate and {coin} price.'
                values={{ coin }}
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
                defaultMessage='By accepting this, you agree to transfer {depositAmountFiat} ({depositAmountCrypto}) plus network fees from your Bitcoin Wallet to your Interest Account. An initial hold period of {lockupPeriod} days will be applied to your funds.'
                values={{
                  lockupPeriod,
                  depositAmountCrypto: `${depositAmountCrypto} ${coinTicker}`,
                  depositAmountFiat: `${currencySymbol}${depositAmountFiat}`
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
  onSubmit: () => void
}

const enhance = compose(
  reduxForm<{}, Props>({ form: FORM_NAME, destroyOnUnmount: false }),
  connector
)

export default enhance(DepositForm) as React.FunctionComponent<Props>
