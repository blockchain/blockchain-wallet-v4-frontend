import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { getLockRuleMessaging } from 'blockchain-wallet-v4-frontend/src/modals/BuySell/model'
import moment from 'moment'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { BSPaymentTypes, FiatType } from '@core/types'
import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import { BankDWStepType, BankPartners } from 'data/types'

import { Props as _P, SuccessStateType as _S } from '.'
import { FormattedBank, LineItemText } from './model'

const BareRow = styled.div`
  padding: 18px 40px;
`

const Row = styled(BareRow)`
  border-bottom: 1px solid ${(p) => p.theme.grey000};
`

const Success = (props: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false)

  const isOpenBanking = props.defaultMethod?.partner === BankPartners.YAPILY
  const backButtonClick = useCallback(() => {
    props.brokerageActions.setDWStep({
      dwStep: BankDWStepType.ENTER_AMOUNT
    })
  }, [])

  const submitButtonClick = useCallback(() => {
    setSubmitting(true)
    props.brokerageActions.createFiatDeposit()
  }, [])

  const amount = props.formValues?.amount || 0
  const showLock = (props.withdrawLockCheck && props.withdrawLockCheck.lockTime > 0) || false
  const days = showLock ? moment.duration(props.withdrawLockCheck?.lockTime, 'seconds').days() : 0

  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='confirmDepositBackButton' mode='back' onClick={backButtonClick}>
        <FormattedMessage id='modals.brokerage.confirm_deposit' defaultMessage='Confirm Deposit' />
      </FlyoutHeader>
      <FlyoutContent mode='top'>
        <Row>
          <Text color='grey800' size='32px' weight={600}>
            {fiatToString({
              unit: props.defaultMethod?.currency as FiatType,
              value: amount
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
            <LineItemText>{moment().add(3, 'days').format('dddd, MMM Do, YYYY')}</LineItemText>
          </Row>
        )}
        <Row>
          <Text color='grey600' size='14px' weight={500} lineHeight='21px'>
            <FormattedMessage id='copy.total' defaultMessage='Total' />
          </Text>
          <LineItemText>
            {fiatToString({
              digits: 0,
              unit: props.defaultMethod?.currency || ('USD' as FiatType),
              value: amount
            })}
          </LineItemText>
        </Row>
        <div style={{ padding: '20px 40px 0' }}>
          {getLockRuleMessaging(showLock, days, BSPaymentTypes.BANK_TRANSFER)}
        </div>
      </FlyoutContent>
      <FlyoutFooter collapsed>
        <Button
          data-e2e='submitDepositAmount'
          height='48px'
          size='16px'
          nature='primary'
          onClick={submitButtonClick}
          fullwidth
          disabled={submitting}
        >
          {submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            <FormattedMessage
              id='modals.simplebuy.deposit.deposit_button'
              defaultMessage='Deposit Now'
            />
          )}
        </Button>
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

type Props = _P & _S

export default Success
