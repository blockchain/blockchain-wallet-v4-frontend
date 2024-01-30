import React, { ReactElement, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { AlertCard } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { BeneficiaryType } from '@core/types'
import { Icon, Image, Text } from 'blockchain-info-components'
import { AddNewButton } from 'components/Brokerage'
import { FlyoutWrapper } from 'components/Flyout'
import { Bank, BankWire } from 'components/Flyout/model'
import { brokerage, withdraw } from 'data/components/actions'
import { BankTransferAccountType, WithdrawStepEnum } from 'data/types'
import { getBankLogoImageName } from 'services/images'

import { BankPickerProps } from '.'
import { BankPickerSelectorProps } from './selectors'

const Top = styled.div`
  display: flex;
  align-items: center;
`
const AlertWrapper = styled(FlyoutWrapper)`
  & > div {
    width: 100% !important;
  }
`

type Props = BankPickerProps & BankPickerSelectorProps

const getLinkedBankIcon = (bankName: string) => (
  <Image name={getBankLogoImageName(bankName)} height='48px' />
)

const Success = ({
  bankTransferAccounts,
  beneficiaries,
  beneficiary,
  defaultMethod,
  fiatCurrency
}: Props) => {
  const [showAlert, setShowAlert] = useState(true)
  const dispatch = useDispatch()

  const withdrawalDisabled = bankTransferAccounts.find(
    (account) => account.capabilities?.withdrawal?.enabled === false
  )

  const changeStep = (account?: BankTransferAccountType, beneficiary?: BeneficiaryType) => {
    dispatch(brokerage.setBankDetails({ account }))
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
      {withdrawalDisabled && showAlert && (
        <AlertWrapper>
          <AlertCard
            variant='warning'
            content={
              withdrawalDisabled?.capabilities?.withdrawal?.ux?.message ||
              'Withdrawals via ACH are disabled'
            }
            onCloseClick={() => setShowAlert((showAlert) => !showAlert)}
            title={
              withdrawalDisabled?.capabilities?.withdrawal?.ux?.title ?? 'Important Information'
            }
          />
        </AlertWrapper>
      )}
      {bankTransferAccounts.map((account) => {
        return (
          <Bank
            key={account.id}
            bankDetails={account.details}
            text={account.details.bankName}
            isActive={account.id === defaultMethod?.id}
            icon={getLinkedBankIcon(account.details.bankName)}
            isDisabled={account.capabilities?.withdrawal?.enabled === false}
            onClick={() => changeStep(account)}
          />
        )
      })}
      {beneficiaries.map((localBeneficiary) => {
        return (
          <BankWire
            key={localBeneficiary.id}
            beneficiary={localBeneficiary}
            isActive={beneficiary?.id === localBeneficiary.id}
            onClick={() => changeStep(undefined, localBeneficiary)}
            type='WITHDRAWAL'
          />
        )
      })}
      <AddNewButton data-e2e='DepositAddNewPaymentMethod' onClick={onAddNew}>
        <Text color='blue600' size='16px' weight={600}>
          <FormattedMessage id='buttons.add_new' defaultMessage='+ Add New' />
        </Text>
      </AddNewButton>
    </div>
  )
}

export default Success
