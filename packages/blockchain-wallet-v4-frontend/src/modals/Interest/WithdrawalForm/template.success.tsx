import {
  Button,
  Icon,
  TabMenu,
  TabMenuItem,
  Text
} from 'blockchain-info-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { equals } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, FormLabel, NumberBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { InterestFormValuesType } from 'data/components/interest/types'
import { maxValue, required } from 'services/FormHelper'
import { OwnProps, SuccessStateType } from '.'
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
  padding-bottom: 32px;
  border-bottom: 1px solid ${props => props.theme.grey000};
`

const BalanceAmount = styled(Text)`
  margin-top: 8px;
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
  margin-top: 8px;
  margin-bottom: 14px;
`

const Spacer = styled.div`
  height: 48px;
  border-right: 1px solid ${props => props.theme.grey000};
`

const ButtonWrapperTitle = styled(Text)`
  margin-bottom: 14px;
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
  margin-bottom: 4px;
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

type LinkStatePropsType = {
  values?: InterestFormValuesType
}

type SuccessOwnProps = {
  handleClose: () => void
}

type Props = SuccessOwnProps & OwnProps & LinkStatePropsType & SuccessStateType

const maxVal = maxValue(10000)

const WithdrawalForm: React.FC<
  InjectedFormProps<{}, Props> & Props
> = props => {
  const [tab, setTab] = useState<'partial' | 'full'>('partial')
  const displayName = props.supportedCoins[props.coin].displayName
  const setPartialTab = () => setTab('partial')
  const setPartialFull = () => setTab('full')

  const { coin } = props
  const balanceAmount = '{balanceAmount}'
  const interestAmount = '{interestAmount}'
  const cryptoAmount = '{cryptoAmount}'
  const fee = '{fee}'
  const formAmount = '{formAmount}'
  const withdrawalFiatAmount = '{withdrawalFiatAmount}'
  const withdrawalCryptoAmount = '{withdrawalCryptoAmount}'
  const totalInterest = '{totalInterest}'

  return (
    <CustomForm>
      <Top>
        <Wrapper>
          <ArrowIcon
            onClick={props.handleClose}
            cursor
            name='arrow-left'
            size='20px'
            color='grey600'
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
            <BalanceAmount color='grey800' weight={600} size='20px'>
              {balanceAmount}
            </BalanceAmount>
          </BalanceItem>
          <Spacer />
          <BalanceItem>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.interest.withdrawal.totalinterest'
                defaultMessage='Total Interest Earned'
              />
            </Text>
            <BalanceAmount color='grey800' weight={600} size='20px'>
              {totalInterest}
            </BalanceAmount>
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
            {...{
              errorBottom: true,
              errorLeft: true,
              errorIcon: 'alert-filled'
            }}
            validate={[required, maxVal]}
          />
          <PrincipalCcyAbsolute>
            <Text color='grey800' size='14px' weight={600}>
              $
            </Text>
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
        <WarningWrapper>
          <WarningIcon color='orange600' cursor name='info' size='20px' />
          <Text color='orange800' size='14px' weight={500}>
            <FormattedMessage
              id='modals.interest.withdrawal.warning'
              defaultMessage='In the last 12 days you earned {interestAmount} {coin} in interest. Once you withdraw {withdrawalFiatAmount} ({withdrawalCryptoAmount}), you will continue to earn interest on the remaining balance.'
              values={{
                coin,
                interestAmount,
                withdrawalFiatAmount,
                withdrawalCryptoAmount
              }}
            />
          </Text>
        </WarningWrapper>
      </Top>
      <Bottom>
        <NetworkFee>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.interest.withdrawal.networkfee1'
              defaultMessage='You are requesting to withdraw '
            />
            {formAmount}
            <FormattedMessage
              id='modals.interest.withdrawal.networkfee2'
              defaultMessage=' ({cryptoAmount}) from your Savings Wallet to your Interest Account, a network fee of {fee} {coin} will be applied.'
              values={{
                coin,
                cryptoAmount,
                fee
              }}
            />
          </Text>
          <Availability>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.interest.withdrawal.availability'
                defaultMessage='Your {coin} will be available in your {coin} Wallet within 5 days.'
                values={{ coin }}
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
  values: selectors.form.getFormValues('withdrawalForm')(state)
})

const enhance = compose(
  reduxForm<{}, Props>({ form: 'withdrawalForm', destroyOnUnmount: false }),
  connect(mapStateToProps)
)

export default enhance(WithdrawalForm) as React.FunctionComponent<Props>
