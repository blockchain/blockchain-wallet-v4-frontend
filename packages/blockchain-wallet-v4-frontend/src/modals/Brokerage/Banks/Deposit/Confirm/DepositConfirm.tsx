import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import useShowConversionAlert from 'blockchain-wallet-v4-frontend/src/hooks/useShowBalanceConversionAlert'
import { addDays, format } from 'date-fns'
import styled from 'styled-components'

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
import { actions, selectors } from 'data'
import {
  BankDWStepType,
  BankPartners,
  BankTransferAccountType,
  BrokerageTxFormValuesType,
  DepositTerms
} from 'data/types'

// Auto margin top so it gets pushed to the bottom
const FiatNoticeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 1rem;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 0.5rem;
  margin: auto 2rem 0;
  border: 1px solid #d46a00;
`

const getBankFormatted = (bank) => {
  if (!bank || !bank.details) return 'Bank Transfer'
  const { accountNumber, bankAccountType, bankName } = bank.details

  return `${bankName} ${bankAccountType?.toLowerCase() || ''} ${accountNumber}`
}

type Props = {
  defaultMethod?: BankTransferAccountType
  depositTerms?: DepositTerms
  formValues: BrokerageTxFormValuesType
}

const Success = ({ defaultMethod, depositTerms, formValues }: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false)

  const dispatch = useDispatch()

  const availableToTradeWithdraw = useSelector(
    selectors.core.walletOptions.getFeatureFlagAvailableToTradeWithdraw
  ).getOrElse(false) as boolean

  const targetCoinName = defaultMethod?.currency
    ? window.coins[defaultMethod.currency].coinfig.name
    : undefined

  const isOpenBanking = defaultMethod?.partner === BankPartners.YAPILY
  const backButtonClick = useCallback(() => {
    dispatch(actions.components.brokerage.setDWStep({ dwStep: BankDWStepType.ENTER_AMOUNT }))
  }, [])

  const submitButtonClick = useCallback(() => {
    setSubmitting(true)
    dispatch(actions.components.brokerage.createFiatDeposit())
  }, [])

  const showConversionDisclaimer = useShowConversionAlert(
    window.coins[defaultMethod!.currency].coinfig
  )

  const amount = formValues?.amount || 0

  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='confirmDepositBackButton' mode='back' onClick={backButtonClick}>
        <FormattedMessage id='modals.brokerage.confirm_deposit' defaultMessage='Confirm Deposit' />
      </FlyoutHeader>
      <FlyoutSubHeader
        data-e2e='depositConfirmAmount'
        title={fiatToString({
          unit: defaultMethod?.currency as FiatType,
          value: amount
        })}
        subTitle=''
      />
      <FlyoutContent mode='top'>
        <CheckoutRow
          text={getBankFormatted(defaultMethod)}
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
            unit: defaultMethod?.currency || ('USD' as FiatType),
            value: amount
          })}
          title={<FormattedMessage id='copy.total' defaultMessage='Total' />}
        />
        {availableToTradeWithdraw && <AvailabilityRows depositTerms={depositTerms} />}

        {showConversionDisclaimer && (
          <FiatNoticeWrapper>
            <Text weight={600} size='14px' lineHeight='21px' style={{ marginBottom: '8px' }}>
              <span style={{ color: '#D46A00' }}>Important information</span>
            </Text>
            <Text size='12px' weight={500} color='grey900'>
              Your {targetCoinName} ({defaultMethod?.currency}) balance will be converted to USDC
              daily at 12:00 am UTC. To avoid any inconvenience, buy crypto or initiate a withdrawal
              before the specified time.
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

export default Success
