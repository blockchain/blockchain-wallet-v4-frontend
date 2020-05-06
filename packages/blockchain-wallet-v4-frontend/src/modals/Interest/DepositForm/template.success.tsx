import { BaseFieldProps, Field, InjectedFormProps, reduxForm } from 'redux-form'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { equals, update } from 'ramda'
import { FormattedMessage } from 'react-intl'
import React, { useState } from 'react'
import styled from 'styled-components'

import { actions, model, selectors } from 'data'
import {
  Button,
  Icon,
  Link,
  SpinningLoader,
  TabMenu,
  TabMenuItem,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import {
  CheckBox,
  CoinBalanceDropdown,
  Form,
  FormLabel,
  NumberBox
} from 'components/Form'
import { Exchange } from 'core'
import { FlyoutWrapper } from 'components/Flyout'
import { formatFiat } from 'blockchain-wallet-v4/src/exchange/currency'
import { InterestDepositFormType } from 'data/components/interest/types'
import { required } from 'services/FormHelper'

import { minimumAmount } from './validation'
import { SuccessStateType } from '.'

const { INTEREST_EVENTS } = model.analytics

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
    padding-left: 30px;
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
  margin: 24px 0;
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
  background-color: ${props => props.theme.greyFade400};
  border: 1px solid ${({ theme }) => theme.grey000};
  box-sizing: border-box;
  border-radius: 8px;
`
const CustomTabMenu = styled(TabMenu)`
  width: 232px;
  margin-bottom: 12px;
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

const DepositForm: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const {
    analyticsActions,
    coin,
    interestActions,
    interestRate,
    invalid,
    // limits,
    walletCurrency,
    rates,
    submitting,
    supportedCoins,
    values
  } = props
  const [tab, setTab] = useState<'long' | 'short'>('long')
  const handleTimeFrameChange = (tab: 'long' | 'short') => {
    analyticsActions.logEvent(
      // @ts-ignore
      update(-1, `calc_term_click_${tab}`, INTEREST_EVENTS.DEPOSIT.CALC_SWITCH)
    )
    setTab(tab)
  }
  const handleFormSubmit = e => {
    e.preventDefault()
    interestActions.submitDepositForm(coin)
  }
  const { coinTicker, displayName } = supportedCoins[coin]
  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const depositAmount = (values && values.depositAmount) || '0'
  const depositAmountFiat = formatFiat(depositAmount)
  const depositAmountCrypto = Exchange.convertCoinToCoin({
    value: Exchange.convertFiatToBtc({
      fromCurrency: walletCurrency,
      toUnit: 'SAT',
      rates,
      value: depositAmount
    }).value,
    coin,
    baseToStandard: true
  }).value

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
    <CustomForm onSubmit={handleFormSubmit}>
      <Top>
        <TopText color='grey800' size='20px' weight={600}>
          <ArrowIcon
            onClick={() =>
              props.interestActions.showInterestModal('ACCOUNT_SUMMARY')
            }
            cursor
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
        <MaxAmountContainer>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.deposit.subtitle'
              defaultMessage='Deposit into your Interest Account and earn {rate}% interest.'
              values={{ rate: interestRate[coin] }}
            />
          </Text>
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
            validate={[required, minimumAmount]}
            {...{
              autoFocus: true,
              errorBottom: true,
              errorLeft: true,
              errorIcon: 'alert-filled'
            }}
          />
          <PrincipalCcyAbsolute>
            <Text color='grey800' size='14px' weight={600}>
              {currencySymbol}
            </Text>
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
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
              defaultMessage='With {currencySymbol}{depositAmountFiat} in your Interest Account you could earn:'
              values={{ currencySymbol, depositAmountFiat }}
            />
          </CalculatorDesc>
          <CalculatorContainer>
            <CustomTabMenu>
              <TabMenuItem
                width='50%'
                data-e2e='longTerm'
                selected={equals(tab, 'long')}
                onClick={() => handleTimeFrameChange('long')}
              >
                <FormattedMessage
                  id='modals.interest.deposit.longterm'
                  defaultMessage='Long-term'
                />
              </TabMenuItem>
              <TabMenuItem
                width='50%'
                data-e2e='shortTerm'
                selected={equals(tab, 'short')}
                onClick={() => handleTimeFrameChange('short')}
              >
                <FormattedMessage
                  id='modals.interest.deposit.shortterm'
                  defaultMessage='Short-term'
                />
              </TabMenuItem>
            </CustomTabMenu>
            <InterestTermWrapper>
              {equals(tab, 'long') ? (
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
              ) : (
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
              )}
            </InterestTermWrapper>
            <Text size='11px' weight={400} style={{ marginTop: '6px' }}>
              <FormattedMessage
                id='modals.interest.deposit.calcfooter'
                defaultMessage='Estimates based on current {coin} deposits earning {rate}% AER.'
                values={{ coin, rate: interestRate[coin] }}
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
              href='https://www.blockchain.com/legal/terms'
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
                id='modals.interest.deposit.agreement'
                defaultMessage='By accepting this, you agree to transfer {depositAmountFiat} ({depositAmountCrypto}) from your wallet to your Interest Account. A lock-up period of 7 days will be applied to your funds.'
                values={{
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

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('interestDepositForm')(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  values?: InterestDepositFormType
}
type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  interestActions: typeof actions.components.interest
}

export type Props = SuccessStateType &
  LinkStatePropsType &
  LinkDispatchPropsType

const enhance = compose(
  reduxForm<{}, Props>({ form: 'interestDepositForm' }),
  connector
)

export default enhance(DepositForm) as React.FunctionComponent<Props>
