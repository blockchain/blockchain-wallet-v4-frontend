import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { addDays, format } from 'date-fns'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { fiatToString } from '@core/exchange/utils'
import { FiatType } from '@core/types'
import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import AvailabilityRows from 'components/Brokerage/AvailabilityRows'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader,
  FlyoutSubHeader
} from 'components/Flyout/Layout'
import { CheckoutRow } from 'components/Rows'
import { BankDWStepType, BankPartners } from 'data/types'
import { getUserLegalEntity } from 'data/modules/profile/selectors'
import { getFiatTransformAlertEnabled } from '@core/redux/walletOptions/selectors'

import { Props as _P, SuccessStateType as _S } from '.'
import { FormattedBank } from './model'
import { getCurrencyName } from './utils'

// Auto margin top so it gets pushed to the bottom
const FiatNoticeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 1rem;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 0.5rem;
  margin: auto 2rem 0;
`

const Success = (props: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false)
  const targetCoinName = getCurrencyName(props.defaultMethod?.currency)

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

  const fiatTransformAlertEnabled = useSelector(getFiatTransformAlertEnabled)
  const userLegalEntity = useSelector(getUserLegalEntity)

  const amount = props.formValues?.amount || 0

  const showChangeAlert = fiatTransformAlertEnabled && true;

  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='confirmDepositBackButton' mode='back' onClick={backButtonClick}>
        <FormattedMessage id='modals.brokerage.confirm_deposit' defaultMessage='Confirm Deposit' />
      </FlyoutHeader>
      <FlyoutSubHeader
        data-e2e='depositConfirmAmount'
        title={fiatToString({
          unit: props.defaultMethod?.currency as FiatType,
          value: amount
        })}
        subTitle=''
      />
      <FlyoutContent mode='top'>
        <CheckoutRow
          text={FormattedBank(props.defaultMethod)}
          title={<FormattedMessage id='copy.from' defaultMessage='From' />}
        />
        <CheckoutRow
          text={targetCoinName}
          title={<FormattedMessage id='copy.to' defaultMessage='To' />}
        />
        {!isOpenBanking && (
          <CheckoutRow
            text={format(addDays(new Date(), 3), 'EEEE, MMM do, yyyy')}
            title={
              <FormattedMessage
                id='modals.brokerage.funds_will_arrive'
                defaultMessage='Funds Will Arrive'
              />
            }
          />
        )}
        <CheckoutRow
          text={fiatToString({
            digits: 0,
            unit: props.defaultMethod?.currency || ('USD' as FiatType),
            value: amount
          })}
          title={<FormattedMessage id='copy.total' defaultMessage='Total' />}
        />
        {props.availableToTradeWithdraw && <AvailabilityRows depositTerms={props.depositTerms} />}

        {showChangeAlert && (
          <FiatNoticeWrapper>
            <Text
              weight={600}
              size='14px'
              lineHeight='21px'
              style={{ marginBottom: '8px' }}
              color='grey900'
            >
              Changes to {props.defaultMethod?.currency} Balances
            </Text>
            <Text size='12px' color='grey900'>
              Your {targetCoinName} ({props.defaultMethod?.currency}) balance will be converted to
              USDC daily at 12:00 am UTC. To avoid any inconvenience, buy crypto or initiate a
              withdrawal before the specified time.
            </Text>
          </FiatNoticeWrapper>
        )}
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
