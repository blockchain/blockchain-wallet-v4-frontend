import { BaseFieldProps, Field, InjectedFormProps, reduxForm } from 'redux-form'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { equals } from 'ramda'
import { FormattedMessage } from 'react-intl'
import React, { useState } from 'react'
import styled from 'styled-components'

import {
  Button,
  Icon,
  TabMenu,
  TabMenuItem,
  Text
} from 'blockchain-info-components'
import { Exchange } from 'core'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, FormLabel, NumberBox } from 'components/Form'
import { formatFiat } from 'core/exchange/currency'
import { InterestWithdrawalFormType } from 'data/components/interest/types'
import { maxValue, required } from 'services/FormHelper'
import { selectors } from 'data'
import FiatDisplay from 'components/Display/FiatDisplay'

import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Top = styled(FlyoutWrapper)`
  padding-bottom: 0;
`
const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
const ArrowIcon = styled(Icon)`
  margin-right: 20px;
`
const BalanceWrapper = styled.div`
  display: flex;
  margin-top: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid ${props => props.theme.grey000};
`
const BalanceItem = styled.div`
  width: 100%;
  &:last-child {
    margin-left: 32px;
  }
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 14px;
  margin-bottom: 14px;
`
const Spacer = styled.div`
  height: 48px;
  border-right: 1px solid ${props => props.theme.grey000};
`
const ButtonWrapperTitle = styled(Text)`
  margin-bottom: 10px;
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
  margin-bottom: 4px;
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
  left: 16px;
`
const WarningWrapper = styled.div`
  display: flex;
  background: ${props => props.theme.orange000};
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
`
const WarningIcon = styled(Icon)`
  margin-right: 16px;
`
const NetworkFee = styled.div`
  display: flex;
  flex-direction: column;
`
const Availability = styled.div`
  margin-top: 24px;
`
const CustomTabMenu = styled(TabMenu)`
  margin-bottom: 12px;
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

const maxVal = maxValue(10000)

const WithdrawalForm: React.FC<InjectedFormProps<{}, Props> &
  Props> = props => {
  const {
    accountBalances,
    coin,
    interestActions,
    rates,
    supportedCoins,
    values,
    walletCurrency
  } = props
  const [tab, setTab] = useState<'partial' | 'full'>('partial')
  const setPartialTab = () => setTab('partial')
  const setPartialFull = () => setTab('full')

  const currencySymbol = Exchange.getSymbol(walletCurrency) as string
  const displayName = supportedCoins[coin].displayName
  const account = accountBalances[coin]
  const withdrawalAmount = formatFiat((values && values.withdrawalAmount) || 0)
  const withdrawalAmountCrypto = Exchange.convertCoinToCoin({
    value: Exchange.convertFiatToBtc({
      fromCurrency: walletCurrency,
      toUnit: 'SAT',
      rates,
      value: parseFloat(withdrawalAmount)
    }).value,
    coin,
    baseToStandard: true
  }).value
  const pendingInterest = Exchange.convertCoinToCoin({
    value: account.pendingInterest,
    coin,
    baseToStandard: true
  }).value

  return (
    <CustomForm>
      <Top>
        <Wrapper>
          <ArrowIcon
            color='grey600'
            cursor
            name='arrow-left'
            onClick={() => interestActions.showInterestModal('ACCOUNT_SUMMARY')}
            size='20px'
          />
          <Text color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='modals.interest.withdrawal.title'
              defaultMessage='Withdraw {displayName}'
              values={{ displayName }}
            />
          </Text>
        </Wrapper>
        <BalanceWrapper>
          <BalanceItem>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.interest.withdrawal.balance'
                defaultMessage='Your {coin} Balance'
                values={{ coin }}
              />
            </Text>
            <FiatDisplay
              coin={coin}
              color='grey800'
              size='20px'
              style={{ marginTop: '8px' }}
              weight={600}
            >
              {account.balance}
            </FiatDisplay>
          </BalanceItem>
          <Spacer />
          <BalanceItem>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.interest.withdrawal.totalinterest'
                defaultMessage='Total Interest Earned'
              />
            </Text>
            <FiatDisplay
              coin={coin}
              color='grey800'
              size='20px'
              style={{ marginTop: '8px' }}
              weight={600}
            >
              {account.totalInterest}
            </FiatDisplay>
          </BalanceItem>
        </BalanceWrapper>
        <ButtonWrapper>
          <ButtonWrapperTitle color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.withdrawal.howmuch'
              defaultMessage='How much do you want to withdraw?'
            />
          </ButtonWrapperTitle>
          <CustomTabMenu>
            <TabMenuItem
              width='50%'
              data-e2e='partialAmount'
              selected={equals(tab, 'partial')}
              onClick={setPartialTab}
            >
              <FormattedMessage
                id='modals.interest.withdrawal.partialamount'
                defaultMessage='Partial amount'
              />
            </TabMenuItem>
            <TabMenuItem
              width='50%'
              data-e2e='fullAmount'
              selected={equals(tab, 'full')}
              onClick={setPartialFull}
            >
              <FormattedMessage
                id='modals.interest.withdrawal.fullamount'
                defaultMessage='Full amount'
              />
            </TabMenuItem>
          </CustomTabMenu>
        </ButtonWrapper>
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.withdrawal.enteramount'
              defaultMessage='Enter withdrawal amount'
            />
          </Text>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            component={NumberBox}
            data-e2e='withdrawalAmount'
            name='withdrawalAmount'
            validate={[required, maxVal]}
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
        <WarningWrapper>
          <WarningIcon color='orange600' cursor name='info' size='20px' />
          <Text color='orange800' size='14px' weight={500}>
            <FormattedMessage
              id='modals.interest.withdrawal.warning'
              defaultMessage='In the last month you have earned {pendingInterestCrypto} in interest. Once you withdraw {withdrawalAmount} ({withdrawalAmountCrypto}), you will continue to earn interest on the remaining balance.'
              values={{
                pendingInterestCrypto: `${pendingInterest} ${coin}`,
                withdrawalAmount: `${currencySymbol}${withdrawalAmount}`,
                withdrawalAmountCrypto: `${withdrawalAmountCrypto} ${coin}`
              }}
            />
          </Text>
        </WarningWrapper>
      </Top>
      <Bottom>
        <NetworkFee>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.withdrawal.recap'
              defaultMessage='You are requesting to withdraw {withdrawalAmount} ({withdrawalAmountCrypto}) from your Savings Wallet to your Interest Account.'
              values={{
                withdrawalAmount: `${currencySymbol}${withdrawalAmount}`,
                withdrawalAmountCrypto: `${withdrawalAmountCrypto} ${coin}`
              }}
            />
          </Text>
          <Availability>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.interest.withdrawal.availability'
                defaultMessage='Your withdrawn {displayName} will be available in your Wallet within 5 days.'
                values={{ displayName }}
              />
            </Text>
          </Availability>
        </NetworkFee>

        <ButtonContainer>
          <Button
            data-e2e='interestWithdrawalSubmit'
            disabled={props.invalid}
            fullwidth
            height='48px'
            nature='primary'
            onClick={props.handleClose}
          >
            <Text size='16px' weight={600} color='white'>
              <FormattedMessage
                id='buttons.confirm_withdrawal'
                defaultMessage='Confirm Withdrawal'
              />
            </Text>
          </Button>
        </ButtonContainer>
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('interestWithdrawalForm')(state)
})

const enhance = compose(
  reduxForm<{}, Props>({ form: 'interestWithdrawalForm' }),
  connect(mapStateToProps)
)

type LinkStatePropsType = {
  values?: InterestWithdrawalFormType
}

type SuccessOwnProps = {
  handleClose: () => void
}

type Props = SuccessOwnProps &
  OwnProps &
  LinkStatePropsType &
  SuccessStateType &
  LinkDispatchPropsType

export default enhance(WithdrawalForm) as React.FunctionComponent<Props>
