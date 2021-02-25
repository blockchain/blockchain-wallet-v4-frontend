import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import React, { useState } from 'react'
import styled from 'styled-components'

import { BankDWStepType } from 'data/types'
import { fiatToString } from 'core/exchange/currency'
import { FiatType } from 'core/types'
import { FlyoutWrapper } from 'components/Flyout'

import { FormattedBank, LineItemText } from './model'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const FlyoutBody = styled(FlyoutWrapper)`
  margin: 0;
  padding: 0;
`

const TopText = styled(Text)`
  display: flex;
  width: 100%;
  align-items: center;
`

const BareRow = styled.div`
  padding: 18px 40px;
`

const Row = styled(BareRow)`
  border-bottom: 1px solid ${p => p.theme.grey000};
`
const ActionsRow = styled(BareRow)`
  margin-top: 80px;
`

const Success = props => {
  const [submitting, setSubmitting] = useState<boolean>(false)

  return (
    <Wrapper>
      <FlyoutWrapper>
        <TopText color='grey800' size='20px' weight={600}>
          <Icon
            cursor
            style={{ marginRight: '24px' }}
            name='arrow-left'
            size='20px'
            color='grey600'
            onClick={() =>
              props.brokerageActions.setStep({
                step: BankDWStepType.ENTER_AMOUNT
              })
            }
          />
          <FormattedMessage
            id='modals.brokerage.confirm_deposit'
            defaultMessage='Confirm Deposit'
          />
        </TopText>
      </FlyoutWrapper>
      <FlyoutBody>
        <Row>
          <Text color='grey800' size='32px' weight={600}>
            {fiatToString({
              value: props.formValues?.amount,
              unit: props.defaultMethod?.currency as FiatType
            })}
          </Text>
        </Row>
        <Row>
          <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
            <FormattedMessage id='copy.from' defaultMessage='From' />
          </Text>
          {FormattedBank(props.defaultMethod)}
        </Row>
        <Row>
          <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
            <FormattedMessage id='copy.to' defaultMessage='To' />
          </Text>
          <LineItemText>
            <FormattedMessage
              id='modals.brokerage.my_currency_wallet'
              defaultMessage='My {currency} Wallet'
              values={{ currency: props.defaultMethod?.currency }}
            />
          </LineItemText>
        </Row>
      </FlyoutBody>

      <ActionsRow>
        <Button
          data-e2e='submitDepositAmount'
          height='48px'
          size='16px'
          nature='primary'
          onClick={() => {
            setSubmitting(true)
            props.brokerageActions.createFiatDeposit()
          }}
          fullwidth
          disabled={submitting}
        >
          {submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            <FormattedMessage
              id='modals.simplebuy.deposit.deposit_button'
              defaultMessage='Deposit {amount}'
              values={{
                amount: fiatToString({
                  value: props.formValues?.amount,
                  unit: props.defaultMethod?.currency || ('USD' as FiatType),
                  digits: 0
                })
              }}
            />
          )}
        </Button>
        <Button
          data-e2e='depositCancel'
          disabled={props.submitting}
          size='16px'
          height='48px'
          nature='light-red'
          onClick={props.handleClose}
          fullwidth
          style={{ marginTop: '16px' }}
        >
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
        </Button>
      </ActionsRow>
    </Wrapper>
  )
}

export default Success
