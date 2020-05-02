import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { equals } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React, { useState } from 'react'
import styled from 'styled-components'

import { actions, selectors } from 'data'
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
import {
  coinToString,
  formatFiat
} from 'blockchain-wallet-v4/src/exchange/currency'
import { Exchange } from 'core'
import { FlyoutWrapper } from 'components/Flyout'
import { InterestFormValuesType } from 'data/components/interest/types'
import { required } from 'services/FormHelper'

import { SuccessStateType } from '.'

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
const CustomField = styled(Field)`
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
  background-color: rgba(240, 242, 247, 0.5);
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.grey000};
  box-sizing: border-box;
  border-radius: 8px;
  height: 140px;
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
const ButtonContainer = styled.div<{ isOpacityApplied?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  opacity: ${({ isOpacityApplied }) => (isOpacityApplied ? 0.25 : 1)};
  > button {
    padding: 15px !important;
  }
`

const DepositForm: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const {
    coin,
    interestActions,
    interestRate,
    invalid,
    // limits,
    walletCurrency,
    submitting,
    supportedCoins,
    values
  } = props
  const [tab, setTab] = useState<'long' | 'short'>('long')
  const handleTimeFrameChange = (x: 'long' | 'short') => setTab(x)
  const handleFormSubmit = e => {
    e.preventDefault()
    interestActions.submitDepositForm(coin)
  }
  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const displayName = supportedCoins[coin].displayName

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
          id='modals.interest.sendinprogress.title'
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
          id='modals.interest.sendinprogress.subtitle'
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
            id='modals.interest.deposittitle'
            defaultMessage='Deposit {displayName}'
            values={{ displayName }}
          />
        </TopText>
        <MaxAmountContainer>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.depositbtc'
              defaultMessage='Deposit into your Interest Account and earn {rate}% interest.'
              values={{ rate: interestRate[coin] }}
            />
          </Text>
        </MaxAmountContainer>
        <CoinBalanceDropdown
          {...props}
          fiatCurrency={walletCurrency}
          name='interest-deposit-select'
        />
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.depositamount'
              defaultMessage='Enter deposit amount'
            />
          </Text>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            component={NumberBox}
            data-e2e='depositAmount'
            name='depositAmount'
            validate={[required]}
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
                id='modals.interest.calculator'
                defaultMessage='Interest Calculator'
              />
            </Text>
            <TooltipHost id='modals.interest.calculator.tooltip'>
              <TooltipIcon name='info' size='14px' />
            </TooltipHost>
          </CalculatorHeaderContainer>
          <CalculatorDesc color='grey600' size='12px' weight={500}>
            <FormattedMessage
              id='modals.interest.calculatordesc'
              defaultMessage='With {currencySymbol}{depositAmount} in your Interest Account you could earn:'
              values={{
                currencySymbol,
                depositAmount: (values && values.depositAmount) || '0.00'
              }}
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
                  id='modals.interest.longterm'
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
                  id='modals.interest.shortterm'
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
                        id='modals.interest.longterm.year'
                        defaultMessage='Year'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      $0.00
                    </Text>
                  </InterestTermContainer>
                  <InterestTermContainer>
                    <Text color='grey600' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.interest.longterm.threeyear'
                        defaultMessage='3 Years'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      $0.00
                    </Text>
                  </InterestTermContainer>
                  <InterestTermContainer>
                    <Text color='grey600' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.interest.longterm.fiveyears'
                        defaultMessage='5 Years'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      $0.00
                    </Text>
                  </InterestTermContainer>
                </>
              ) : (
                <>
                  <InterestTermContainer>
                    <Text color='grey600' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.interest.shortterm.daily'
                        defaultMessage='Daily'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      $0.00
                    </Text>
                  </InterestTermContainer>
                  <InterestTermContainer>
                    <Text color='grey600' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.interest.shortterm.weekly'
                        defaultMessage='Weekly'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      $0.00
                    </Text>
                  </InterestTermContainer>
                  <InterestTermContainer>
                    <Text color='grey600' size='12px' weight={500}>
                      <FormattedMessage
                        id='modals.interest.shortterm.monthly'
                        defaultMessage='Monthly'
                      />
                    </Text>
                    <Text color='grey800' weight={600}>
                      $0.00
                    </Text>
                  </InterestTermContainer>
                </>
              )}
            </InterestTermWrapper>
            <Text size='11px' weight={400} style={{ marginTop: '6px' }}>
              <FormattedMessage
                id='modals.interest.deposit.calculator.footer'
                defaultMessage='Estimates based on current BTC price earning {rate}% AER.'
                values={{ rate: interestRate[coin] }}
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
                id='modals.interest.terms.read'
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
                id='modals.interest.termsservice'
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
                id='modals.interest.privacy'
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
                id='modals.interest.agreement1'
                defaultMessage='By accepting this, you agree to transfer'
              />
            </Text>{' '}
            <Text lineHeight='1.4' size='14px' weight={600}>
              {currencySymbol}
              {formatFiat((values && values.depositAmount) || 0)}
            </Text>
            {' ('}
            <Text lineHeight='1.4' size='14px' weight={500}>
              {coinToString({
                value: 0,
                unit: { symbol: coin }
              })}
            </Text>
            {') '}
            <Text lineHeight='1.4' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.agreement2'
                defaultMessage='from your wallet to your Interest Account. A lock-up period of 7 days will be applied to your funds.'
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
                id='modals.interest.confirmdeposit'
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
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type LinkStatePropsType = {
  values?: InterestFormValuesType
}
type LinkDispatchPropsType = {
  interestActions: typeof actions.components.interest
}

type Props = SuccessStateType & LinkStatePropsType & LinkDispatchPropsType

const enhance = compose(
  reduxForm<{}, Props>({ form: 'interestDepositForm' }),
  connector
)

export default enhance(DepositForm) as React.FunctionComponent<Props>
