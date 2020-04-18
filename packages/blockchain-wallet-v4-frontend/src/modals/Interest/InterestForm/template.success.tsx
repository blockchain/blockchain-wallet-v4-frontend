import {
  Button,
  Icon,
  Link,
  TabMenu,
  TabMenuItem,
  Text
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
import { compose } from 'redux'
import { connect } from 'react-redux'
import { equals } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { InterestFormValuesType } from 'data/components/interest/types'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import { selectors } from 'data'
import React, { useState } from 'react'
import styled from 'styled-components'

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
  justify-content: space-between;
  align-items: center;
`

const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 56px;
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

// related to line 122
// const FiatContainer = styled.div`
//   cursor: pointer;
//   display: inline-block;
//   padding: 4px 8px;
//   border-radius: 20px;
//   background-color: ${props => props.theme.grey000};
// `

const CalculatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 28px;
`

const CalculatorHeaderContainer = styled.div`
  display: flex;
`

const CalculatorDesc = styled(Text)`
  margin: 4px 0;
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
  height: 128px;
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

const OpacityContainer = styled.div<{ isOpacityApplied?: boolean }>`
  opacity: ${({ isOpacityApplied }) => (isOpacityApplied ? 0.25 : 1)};
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

const ButtonContainer = styled.div<{ isOpacityApplied?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  opacity: ${({ isOpacityApplied }) => (isOpacityApplied ? 0.25 : 1)};
  > button {
    padding: 15px !important;
  }
`

type LinkStatePropsType = {
  values?: InterestFormValuesType
}

type Props = OwnProps &
  LinkDispatchPropsType &
  LinkStatePropsType &
  SuccessStateType

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const [tab, setTab] = useState<'long' | 'short'>('long')
  const displayName = props.supportedCoins['PAX'].displayName
  const savingsAmount = '$0.00' // replace this with future user savings' amount
  const handleClick = (x: 'long' | 'short') => setTab(x)
  const isTermsChecked = props.values ? props.values.terms : props.values
  const isAgreementChecked = props.values
    ? props.values.agreement
    : props.values
  const isCheckBoxDisabled = props.values
    ? props.values.depositAmount < props.minimumDeposit
    : false

  return (
    <CustomForm>
      <Top>
        <TopText color='grey800' size='20px' weight={600}>
          <FormattedMessage
            id='modals.interest.deposittitle'
            defaultMessage='Deposit {displayName}'
            values={{ displayName }}
          />
          <Icon
            onClick={props.handleClose}
            cursor
            name='close'
            size='20px'
            color='grey600'
          />
        </TopText>
        <MaxAmountContainer>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.candeposit'
              defaultMessage='You can deposit up to'
            />
            {' $6888 '}
            {/* leaving this for future implementation
            <FiatContainer
              onClick={() => props.borrowActions.handleMaxCollateralClick()}
            >
              <Text color='blue600' size='14px' weight={500}>
                {fiatToString({
                  value: props.limits.maxFiat,
                  unit: { symbol: '$' }
                })}
              </Text>
            </FiatContainer>{' '} */}
            <FormattedMessage
              id='modals.interest.earninterest'
              defaultMessage='of {displayName} to your Savings Wallet and earn 3% interest.'
              values={{ displayName }}
            />
          </Text>
        </MaxAmountContainer>
        <CoinBalanceDropdown {...props} name='interest-deposit-select' />
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
            {...{
              autoFocus: true,
              errorBottom: true,
              errorLeft: true,
              errorIcon: 'alert-filled'
            }}
          />
          <PrincipalCcyAbsolute>
            <Text color='grey800' size='14px' weight={600}>
              $
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
          </CalculatorHeaderContainer>
          <CalculatorDesc color='grey600' size='12px' weight={500}>
            <FormattedMessage
              id='modals.interest.calculatordesc'
              defaultMessage='With {savingsAmount} in your Savings Wallet you would earn:'
              values={{ savingsAmount }}
            />
          </CalculatorDesc>
          <CalculatorContainer>
            <CustomTabMenu>
              <TabMenuItem
                width='50%'
                data-e2e='longTerm'
                selected={equals(tab, 'long')}
                onClick={() => handleClick('long')}
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
                onClick={() => handleClick('short')}
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
          </CalculatorContainer>
        </CalculatorWrapper>
      </Top>
      <Bottom>
        <>
          <OpacityContainer isOpacityApplied={isCheckBoxDisabled}>
            <Field
              name='terms'
              component={CheckBox}
              disabled={isCheckBoxDisabled}
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
                  &
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
              name='agreement'
              component={CheckBox}
              disabled={isCheckBoxDisabled}
            >
              <AgreementContainer>
                <Text lineHeight='1.4' size='14px' weight={500}>
                  <FormattedMessage
                    id='modals.interest.agreement1'
                    defaultMessage='By accepting this, you agree to transfer'
                  />
                </Text>{' '}
                <Text lineHeight='1.4' size='14px' weight={600}>
                  $
                  {formatFiat(
                    props.values
                      ? props.values.depositAmount
                        ? props.values.depositAmount
                        : 0
                      : 0
                  )}
                </Text>
                {' ('}
                <Text lineHeight='1.4' size='14px' weight={500}>
                  {coinToString({
                    value: 0,
                    unit: { symbol: props.coin }
                  })}
                </Text>
                {') '}
                <Text lineHeight='1.4' size='14px' weight={500}>
                  <FormattedMessage
                    id='modals.interest.agreement2'
                    defaultMessage='from your Bitcoin Vault Wallet to your Savings Wallet. A lock-up period of 30 days will be applied to your funds.'
                  />
                </Text>
              </AgreementContainer>
            </Field>
          </OpacityContainer>
          <ButtonContainer>
            <Button
              data-e2e='interestDepositSubmit'
              fullwidth
              height='48px'
              nature='primary'
              onClick={props.handleClose}
              disabled={!isTermsChecked || !isAgreementChecked}
            >
              <Text size='16px' weight={600} color='white'>
                <FormattedMessage
                  id='modals.interest.confirmdeposit'
                  defaultMessage='Confirm Deposit'
                />
              </Text>
            </Button>
          </ButtonContainer>
        </>
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('interestForm')(state)
})

const enhance = compose(
  reduxForm<{}, Props>({ form: 'interestForm', destroyOnUnmount: false }),
  connect(mapStateToProps)
)

export default enhance(Success) as React.FunctionComponent<Props>
