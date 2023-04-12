import React, { ReactElement, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { AlertCard } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import { AddNewButton } from 'components/Brokerage'
import { FlyoutWrapper } from 'components/Flyout'
import { Bank, BankWire } from 'components/Flyout/model'
import { WithdrawStepEnum } from 'data/types'
import { getBankLogoImageName } from 'services/images'

import { Props as OwnProps, SuccessStateType } from '.'

const Top = styled.div`
  display: flex;
  align-items: center;
`
const AlertWrapper = styled(FlyoutWrapper)`
  & > div {
    width: 100% !important;
  }
`

const getLinkedBankIcon = (bankName: string): ReactElement => (
  <Image name={getBankLogoImageName(bankName)} height='48px' />
)

const Success = (props: Props) => {
  const {
    bankTransferAccounts,
    beneficiaries,
    brokerageActions,
    defaultMethod,
    fiatCurrency,
    withdrawActions
  } = props
  const [showAlert, setShowAlert] = useState(true)

  const withdrawalDisabled = bankTransferAccounts.find(
    (account) => account.capabilities?.withdrawal?.enabled === false
  )

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
            onClick={() =>
              withdrawActions.setStep({
                fiatCurrency,
                step: WithdrawStepEnum.ENTER_AMOUNT
              })
            }
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
            onClick={() => {
              brokerageActions.setBankDetails({ account })
              withdrawActions.setStep({
                beneficiary: undefined,
                fiatCurrency: props.fiatCurrency,
                step: WithdrawStepEnum.ENTER_AMOUNT
              })
            }}
          />
        )
      })}
      {beneficiaries.map((beneficiary) => {
        return (
          <BankWire
            key={beneficiary.id}
            beneficiary={beneficiary}
            isActive={props.beneficiary?.id === beneficiary.id}
            onClick={() => {
              brokerageActions.setBankDetails({ account: undefined })
              withdrawActions.setStep({
                beneficiary,
                fiatCurrency,
                step: WithdrawStepEnum.ENTER_AMOUNT
              })
            }}
            type='WITHDRAWAL'
          />
        )
      })}
      <AddNewButton
        data-e2e='DepositAddNewPaymentMethod'
        onClick={() => {
          withdrawActions.setStep({
            fiatCurrency,
            step: WithdrawStepEnum.WITHDRAWAL_METHODS
          })
        }}
      >
        <Text color='blue600' size='16px' weight={600}>
          <FormattedMessage id='buttons.add_new' defaultMessage='+ Add New' />
        </Text>
      </AddNewButton>
    </div>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
