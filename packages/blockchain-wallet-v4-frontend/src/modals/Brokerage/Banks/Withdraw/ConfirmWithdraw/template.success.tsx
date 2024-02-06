import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import { FlyoutWrapper, Row, Value } from 'components/Flyout'
import Form from 'components/Form/Form'
import { withdraw } from 'data/components/actions'
import { brokerage } from 'data/components/selectors'
import { getAmount } from 'data/components/withdraw/selectors'
import { getUserCountryCode } from 'data/modules/profile/selectors'
import { WithdrawCheckoutFormValuesType } from 'data/types'
import { useSardineContext } from 'hooks'

import { ConfirmWithdrawProps } from '.'

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
  const dispatch = useDispatch()

  const [sardineContextIsReady, sardineContext] = useSardineContext('WITHDRAWAL')

  const userCountryCode = useSelector(getUserCountryCode).getOrElse('default')
  const defaultMethod = useSelector(brokerage.getAccount)
  const amount = useSelector(getAmount) ?? '0'

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(
      withdraw.handleCustodyWithdraw({
        amount,
        beneficiary: props.beneficiary || defaultMethod || null,
        fiatCurrency: props.fiatCurrency
      })
    )
    if (sardineContextIsReady) {
      sardineContext.updateConfig({ flow: 'WITHDRAWAL' })
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <FlyoutWrapper>
        <Top>
          <Icon
            name='arrow-left'
            size='20px'
            role='button'
            style={{ marginRight: '16px' }}
            onClick={props.onClickBack}
          />
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage id='copy.confirm_withdrawal' defaultMessage='Confirm Withdrawal' />
          </Text>
        </Top>
        <AmountContainer>
          <CoinDisplay color='grey800' size='32px' weight={600} coin={props.fiatCurrency}>
            {amount}
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
        <Value>{props.beneficiary?.name || defaultMethod?.details.bankName}</Value>
        <Value>{defaultMethod?.details.accountName || ''}</Value>
      </Row>
      <Row>
        <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
          <FormattedMessage id='copy.fee' defaultMessage='Fee' />
        </Text>
        <Value>
          {fiatToString({
            digits: 2,
            unit: props.fiatCurrency,
            value: props.fees.value
          })}
        </Value>
      </Row>
      <Row>
        <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
          <FormattedMessage id='copy.total' defaultMessage='Total' />
        </Text>
        <Value>
          {fiatToString({
            digits: 2,
            unit: props.fiatCurrency,
            value: amount
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
          onClick={props.onClickBack}
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

type Props = {
  fees: any
  onClickBack: () => void
} & ConfirmWithdrawProps

export default reduxForm<WithdrawCheckoutFormValuesType, Props>({
  destroyOnUnmount: false,
  form: 'confirmCustodyWithdraw'
})(Success)
