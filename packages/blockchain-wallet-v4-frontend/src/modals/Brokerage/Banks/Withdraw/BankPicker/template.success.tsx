import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import { AddNewButton } from 'components/Brokerage'
import { FlyoutWrapper } from 'components/Flyout'
import { WithdrawStepEnum } from 'data/types'
import { getBankLogoImageName } from 'services/images'

import { Bank, BankWire } from '../../model'
import { Props as OwnProps, SuccessStateType } from '.'

const Top = styled.div`
  display: flex;
  align-items: center;
`

const getLinkedBankIcon = (bankName: string): ReactElement => (
  <Image name={getBankLogoImageName(bankName)} height='48px' />
)

const Success: React.FC<Props> = props => {
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
              props.withdrawActions.setStep({
                step: WithdrawStepEnum.ENTER_AMOUNT,
                fiatCurrency: props.fiatCurrency
              })
            }
          />
          <Text color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='scenes.settings.linked_banks'
              defaultMessage='Linked Banks'
            />
          </Text>
        </Top>
      </FlyoutWrapper>
      {props.bankTransferAccounts.map(account => {
        return (
          <Bank
            key={account.id}
            bankDetails={account.details}
            text={account.details.bankName}
            isActive={account.id === props.defaultMethod?.id}
            icon={getLinkedBankIcon(account.details.bankName)}
            onClick={() => {
              props.brokerageActions.setBankDetails({ account })
              props.withdrawActions.setStep({
                beneficiary: undefined,
                fiatCurrency: props.fiatCurrency,
                step: WithdrawStepEnum.ENTER_AMOUNT
              })
            }}
          />
        )
      })}
      {props.beneficiaries.map(beneficiary => {
        return (
          <BankWire
            beneficiary={beneficiary}
            isActive={props.beneficiary?.id === beneficiary.id}
            onClick={() => {
              props.brokerageActions.setBankDetails({ account: undefined })
              props.withdrawActions.setStep({
                beneficiary,
                fiatCurrency: props.fiatCurrency,
                step: WithdrawStepEnum.ENTER_AMOUNT
              })
            }}
            type={'WITHDRAWAL'}
          />
        )
      })}
      <AddNewButton
        data-e2e='DepositAddNewPaymentMethod'
        onClick={() => {
          props.withdrawActions.setStep({
            fiatCurrency: props.fiatCurrency,
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
