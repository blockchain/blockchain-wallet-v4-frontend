import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { addDays, format } from 'date-fns'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { getFeatureFlagAvailableToTradeWithdraw } from '@core/redux/walletOptions/selectors'
import { CoinfigType, FiatType } from '@core/types'
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
import { brokerage } from 'data/components/actions'
import {
  BankDWStepType,
  BankPartners,
  BankTransferAccountType,
  BrokerageTxFormValuesType,
  DepositTerms
} from 'data/types'
import { useShowConversionAlert } from 'hooks'
import { Padding } from '@blockchain-com/constellation'
import { MoreInfoContainer } from './MoreInfoContainer'

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
  if (!bank?.details) return 'Bank Transfer'
  const { accountNumber, bankAccountType, bankName } = bank.details

  return `${bankName} ${bankAccountType?.toLowerCase() || ''} ${accountNumber}`
}

type Props = {
  defaultMethod?: BankTransferAccountType
  depositTerms?: DepositTerms
  formValues: BrokerageTxFormValuesType
}

const Success = ({ defaultMethod, depositTerms, formValues }: Props) => {
  const [submitting, setSubmitting] = useState(false)

  const dispatch = useDispatch()

  const availableToTradeWithdraw = useSelector(getFeatureFlagAvailableToTradeWithdraw).getOrElse(
    false
  ) as boolean

  const { coinfig } = defaultMethod?.currency
    ? window.coins[defaultMethod.currency]
    : { coinfig: {} as CoinfigType }

  const targetCoinName = coinfig?.name

  const isOpenBanking = defaultMethod?.partner === BankPartners.YAPILY

  const backButtonClick = useCallback(() => {
    dispatch(brokerage.setDWStep({ dwStep: BankDWStepType.ENTER_AMOUNT }))
  }, [])

  const submitButtonClick = useCallback(() => {
    setSubmitting(true)
    dispatch(brokerage.createFiatDeposit())
  }, [])

  const showConversionDisclaimer = useShowConversionAlert(coinfig)

  const amount = formValues?.amount ?? 0

  const formattedAmount = fiatToString({
    unit: defaultMethod?.currency ?? ('USD' as FiatType),
    value: amount
  })

  const bankAccount = getBankFormatted(defaultMethod)

  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='confirmDepositBackButton' mode='back' onClick={backButtonClick}>
        <FormattedMessage id='modals.brokerage.confirm_deposit' defaultMessage='Confirm Deposit' />
      </FlyoutHeader>
      <FlyoutSubHeader data-e2e='depositConfirmAmount' title={formattedAmount} subTitle='' />
      <FlyoutContent mode='top'>
        <CheckoutRow
          text={bankAccount}
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
          text={formattedAmount}
          title={<FormattedMessage id='copy.total' defaultMessage='Total' />}
        />
        {availableToTradeWithdraw && <AvailabilityRows depositTerms={depositTerms} />}

        <MoreInfoContainer
          teaser={
            <FormattedMessage
              id='modals.deposit.confirm.by_placing_this_order'
              defaultMessage='By placing this order, you authorize Blockchain.com, Inc. to debit {totalAmount} from your bank account.'
              values={{ totalAmount: formattedAmount }}
            />
          }
          text={
            <>
              <Padding bottom={1}>
                <FormattedMessage
                  id='modals.deposit.confirm.you_authorize_blockchain'
                  defaultMessage='You authorize Blockchain.com, Inc. to debit your {paymentAccount} account for up to {totalAmount} via Bank Transfer (ACH) and, if necessary, to initiate credit entries/adjustments for any debits made in error to your account at the financial institution where you hold your account.'
                  values={{ paymentAccount: bankAccount, totalAmount: formattedAmount }}
                />
                <br />

                <FormattedMessage
                  id='modals.deposit.confirm.acknowledge_origin'
                  defaultMessage='You acknowledge that the origination of ACH transactions to your account complies with the provisions of U.S. law.'
                />
              </Padding>
              <Padding bottom={1}>
                <FormattedMessage
                  id='modals.deposit.confirm.agree_cannot_revoke'
                  defaultMessage='You agree that this authorization cannot be revoked. The debit will post to your bank account within 1-2 business days of you authorizing this transfer.'
                />
              </Padding>
              <Padding bottom={1}>
                <FormattedMessage
                  id='modals.deposit.confirm.your_deposit_will_be_credited'
                  defaultMessage='Your deposit will be credited to your Blockchain.com account within 2-4 business days at the rate shown at the time of your purchase. You can withdraw these funds from your Blockchain.com account {withdrawalLockDays} days after Blockchain.com receives funds from your financial institution.'
                  values={{ withdrawalLockDays: depositTerms?.withdrawalLockDays ?? 3 }}
                />
              </Padding>
            </>
          }
        />

        {showConversionDisclaimer && (
          <FiatNoticeWrapper>
            <Text weight={600} size='14px' lineHeight='21px' style={{ marginBottom: '8px' }}>
              <span style={{ color: '#D46A00' }}>Important information</span>
            </Text>
            <Text size='12px' weight={500} color='grey900'>
              Your {targetCoinName} ({defaultMethod?.currency}) balance will be converted to USDC
              daily at 12:00 am UTC. To avoid any inconvenience buy crypto before the specified
              time.
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
