import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { AlertCard } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { BeneficiaryType } from '@core/types'
import { Icon, Image, Text } from 'blockchain-info-components'
import { AddNewButton } from 'components/Brokerage'
import { FlyoutWrapper } from 'components/Flyout'
import { Bank, BankWire } from 'components/Flyout/model'
import { withdraw } from 'data/components/actions'
import { getBeneficiary } from 'data/components/withdraw/selectors'
import { WithdrawStepEnum } from 'data/types'
import { getBankLogoImageName } from 'services/images'

import { BankPickerProps } from '.'
import { BankPickerSelectorProps } from './selectors'

const Top = styled.div`
  display: flex;
  align-items: center;
`
const AlertWrapper = styled(FlyoutWrapper)`
  padding-bottom: 1rem;
  padding-top: 0;
  & > div {
    width: 100% !important;
  }
`

const noOp = () => {}

type Props = BankPickerProps & BankPickerSelectorProps

const getLinkedBankIcon = (bankName: string) => (
  <Image name={getBankLogoImageName(bankName)} height='48px' />
)

const Success = ({ bankTransferAccounts, beneficiaries, fiatCurrency }: Props) => {
  const dispatch = useDispatch()

  const withdrawalDisabled = bankTransferAccounts.find(
    (account) => account.capabilities?.withdrawal?.enabled === false
  )

  const beneficiary = useSelector(getBeneficiary)

  const changeStep = (beneficiary?: BeneficiaryType) => {
    dispatch(
      withdraw.setStep({
        beneficiary,
        fiatCurrency,
        step: WithdrawStepEnum.ENTER_AMOUNT
      })
    )
  }

  const onAddNew = () => {
    dispatch(
      withdraw.setStep({
        fiatCurrency,
        step: WithdrawStepEnum.WITHDRAWAL_METHODS
      })
    )
  }

  return (
    <div>
      <FlyoutWrapper>
        <Top>
          <Icon
            cursor
            data-e2e='withdrawBack'
            name='arrow-left'
            size='20px'
            color='grey600'
            role='button'
            style={{ marginRight: '8px' }}
            onClick={() => changeStep()}
          />
          <Text color='grey800' size='20px' weight={600}>
            <FormattedMessage id='scenes.settings.linked_banks' defaultMessage='Linked Banks' />
          </Text>
        </Top>
      </FlyoutWrapper>
      {withdrawalDisabled && (
        <AlertWrapper>
          <AlertCard
            variant='warning'
            content={
              withdrawalDisabled?.capabilities?.withdrawal?.ux?.message ||
              'Withdrawals via ACH are disabled'
            }
            title={
              withdrawalDisabled?.capabilities?.withdrawal?.ux?.title ?? 'Important Information'
            }
          />
        </AlertWrapper>
      )}

      {bankTransferAccounts.map((account) => (
        <Bank
          key={account.id}
          bankDetails={account.details}
          text={account.details.bankName}
          isActive={false} // Not selectable on withdrawals so safe to asume shouldn't be active
          icon={getLinkedBankIcon(account.details.bankName)}
          isDisabled={account.capabilities?.withdrawal?.enabled === false}
          onClick={noOp}
        />
      ))}
      {beneficiaries.map((localBeneficiary) => (
        <BankWire
          key={localBeneficiary.id}
          beneficiary={localBeneficiary}
          isActive={beneficiary?.id === localBeneficiary.id}
          onClick={() => changeStep(localBeneficiary)}
          type='WITHDRAWAL'
        />
      ))}
      <AddNewButton data-e2e='DepositAddNewPaymentMethod' onClick={onAddNew}>
        <Text color='blue600' size='16px' weight={600}>
          <FormattedMessage id='buttons.add_new' defaultMessage='+ Add New' />
        </Text>
      </AddNewButton>
    </div>
  )
}

export default Success
