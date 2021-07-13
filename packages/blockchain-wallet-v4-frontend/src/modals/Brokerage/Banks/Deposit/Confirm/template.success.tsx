import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { FiatType } from 'blockchain-wallet-v4/src/types'
import { FlyoutWrapper } from 'components/Flyout'
import { model } from 'data'
import { BankDWStepType, BankPartners } from 'data/types'

import { FormattedBank, LineItemText } from './model'

const { DEPOSIT_CANCEL, DEPOSIT_CONFIRM } = model.analytics.FIAT_DEPOSIT_EVENTS

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

  const isOpenBanking = props.defaultMethod?.partner === BankPartners.YAPILY

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
              id='modals.brokerage.fiat_account'
              defaultMessage='{currency} Account'
              values={{ currency: props.defaultMethod?.currency }}
            />
          </LineItemText>
        </Row>
        {!isOpenBanking && (
          <Row>
            <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
              <FormattedMessage
                id='modals.brokerage.funds_will_arrive'
                defaultMessage='Funds Will Arrive'
              />
            </Text>
            <LineItemText>
              {moment()
                .add(3, 'days')
                .format('dddd, MMM Do, YYYY')}
            </LineItemText>
          </Row>
        )}
        <Row>
          <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
            <FormattedMessage id='copy.total' defaultMessage='Total' />
          </Text>
          <LineItemText>
            {fiatToString({
              value: props.formValues?.amount,
              unit: props.defaultMethod?.currency || ('USD' as FiatType),
              digits: 0
            })}
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
            props.analyticsActions.logEvent(DEPOSIT_CONFIRM)
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
          onClick={() => {
            props.handleClose()
            props.analyticsActions.logEvent(DEPOSIT_CANCEL)
          }}
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
