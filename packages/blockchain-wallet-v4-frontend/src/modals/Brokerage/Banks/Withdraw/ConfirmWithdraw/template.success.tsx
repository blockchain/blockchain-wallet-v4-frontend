import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { FiatType, NabuSymbolNumberType } from '@core/types'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import { FlyoutWrapper, Row, Value } from 'components/Flyout'
import Form from 'components/Form/Form'
import { WithdrawCheckoutFormValuesType, WithdrawStepEnum } from 'data/types'
import { useSardineContext } from 'hooks'

import { Props as OwnProps, SuccessStateType } from '.'

const Top = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`
const SubTitle = styled(Text)`
  text-align: center;
  line-height: 150%;
  margin-top: 32px;
`
const AmountContainer = styled.div`
  margin-top: 40px;
  margin-bottom: 24px;
  display: flex;
`

const RowDisclaimer = styled(Row)`
  padding-top: 0px;
  padding-bottom: 0px;
`

const ErrorContainer = styled(FlyoutWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0px;
  margin-top: 0px;
`

const Success: React.FC<InjectedFormProps<WithdrawCheckoutFormValuesType, Props> & Props> = (
  props
) => {
  const userCountryCode = props.userData?.address?.country || 'default'
  const [sardineContextIsReady, sardineContext] = useSardineContext('WITHDRAWAL')

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        props.withdrawActions.handleCustodyWithdraw({
          amount: props.formValues.amount,
          beneficiary: props.beneficiary || props.defaultMethod || null,
          fiatCurrency: props.fiatCurrency
        })
        if (sardineContextIsReady) {
          sardineContext.updateConfig({
            flow: 'WITHDRAWAL'
          })
        }
      }}
    >
      <FlyoutWrapper>
        <Top>
          <Icon
            name='arrow-left'
            size='20px'
            role='button'
            style={{ marginRight: '16px' }}
            onClick={() =>
              props.withdrawActions.setStep({
                beneficiary: props.beneficiary,
                fiatCurrency: props.fiatCurrency,
                step: WithdrawStepEnum.ENTER_AMOUNT
              })
            }
          />
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage id='copy.confirm_withdrawal' defaultMessage='Confirm Withdrawal' />
          </Text>
        </Top>
        <AmountContainer>
          <CoinDisplay color='grey800' size='32px' weight={600} coin={props.fiatCurrency}>
            {props.amount}
          </CoinDisplay>
        </AmountContainer>
      </FlyoutWrapper>
      <Row>
        <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
          <FormattedMessage id='copy.from' defaultMessage='From' />
        </Text>
        <Value>{window.coins[props.fiatCurrency]?.coinfig.name ?? props.fiatCurrency}</Value>
      </Row>
      <Row>
        <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
          <FormattedMessage id='copy.to' defaultMessage='To' />
        </Text>
        <Value>{props.beneficiary?.name || props.defaultMethod?.details.bankName}</Value>
        <Value>{props.defaultMethod?.details.accountName || ''}</Value>
      </Row>
      <Row>
        <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
          <FormattedMessage id='copy.fee' defaultMessage='Fee' />
        </Text>
        <Value>
          {props.fees.value} {props.fiatCurrency}
        </Value>
      </Row>
      <Row>
        <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
          <FormattedMessage id='copy.total' defaultMessage='Total' />
        </Text>
        <Value>
          {fiatToString({
            digits: 0,
            unit: props.fiatCurrency || ('USD' as FiatType),
            value: props.amount
          })}
        </Value>
      </Row>
      <RowDisclaimer>
        <SubTitle size='14px' color='grey600' weight={500}>
          {userCountryCode === 'AR' ? (
            <FormattedMessage
              id='modals.simplebuy.withdrawal.arrive_description_ARS'
              defaultMessage='The funds can take up to 3 business days to arrive. Check the status of your Withdrawal at anytime from your Activity screen.'
            />
          ) : (
            <FormattedMessage
              id='modals.simplebuy.withdrawal.arrive_description_default'
              defaultMessage='The funds can take up to 5 business days to arrive. Check the status of your Withdrawal at anytime from your Activity screen.'
            />
          )}
        </SubTitle>
      </RowDisclaimer>
      <FlyoutWrapper>
        <Button
          data-e2e='withdrawCustody'
          disabled={props.submitting}
          fullwidth
          height='48px'
          nature='primary'
          size='16px'
          type='submit'
        >
          {props.submitting ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <FormattedMessage
              id='modals.simplebuy.withdrawal.withdrawal_button'
              defaultMessage='Withdraw Now'
            />
          )}
        </Button>
        <Button
          data-e2e='cancelCustody'
          disabled={props.submitting}
          fullwidth
          height='48px'
          nature='empty-red'
          size='16px'
          margin='20px 0 0'
          onClick={() =>
            props.withdrawActions.setStep({
              beneficiary: props.beneficiary,
              fiatCurrency: props.fiatCurrency,
              step: WithdrawStepEnum.ENTER_AMOUNT
            })
          }
        >
          {props.submitting ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <FormattedMessage
              id='modals.simplebuy.withdrawal.cancel_button'
              defaultMessage='Cancel'
            />
          )}
        </Button>
      </FlyoutWrapper>
      {props.error && !props.submitting && (
        <ErrorContainer>
          <ErrorCartridge>{props.error}</ErrorCartridge>
        </ErrorContainer>
      )}
    </Form>
  )
}

export type Props = OwnProps & SuccessStateType & { fees: NabuSymbolNumberType }

export default reduxForm<WithdrawCheckoutFormValuesType, Props>({
  destroyOnUnmount: false,
  form: 'confirmCustodyWithdraw'
})(Success)
