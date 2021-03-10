import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image, Text } from 'blockchain-info-components'
import {
  BankTransferAccountType,
  BeneficiaryType,
  NabuMoneyFloatType
} from 'blockchain-wallet-v4/src/types'
import { AddNewButton } from 'components/Brokerage'
import { FlyoutWrapper } from 'components/Flyout'
import { BankDWStepType } from 'data/types'
import { getBankLogoImageName } from 'services/images'

import { Bank, BankWire } from '../../model'
import { Props as _P } from '.'

type OwnProps = {
  account: BankTransferAccountType | undefined
  bankTransferAccounts: BankTransferAccountType[]
  beneficiaries: BeneficiaryType[]
  minAmount: NabuMoneyFloatType
}
type Props = _P & OwnProps

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Header = styled(FlyoutWrapper)`
  padding: 40px 40px 16px 40px;
`

const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 7px;
`

const AccountsListWrapper = styled.div`
  border-top: 1px solid ${props => props.theme.grey000};
`

const getLinkedBankIcon = (bankName: string): ReactElement => (
  <Image name={getBankLogoImageName(bankName)} height='48px' />
)

const BankList = (props: Props) => {
  return (
    <Wrapper>
      <Header>
        <TopText color='grey800' size='20px' weight={600}>
          <Icon
            cursor
            name='arrow-back'
            size='20px'
            color='grey600'
            style={{ marginRight: '28px' }}
            role='button'
            onClick={() =>
              props.brokerageActions.setDWStep({
                dwStep: BankDWStepType.ENTER_AMOUNT
              })
            }
          />
          <div>
            <FormattedMessage
              id='scenes.settings.linked_banks'
              defaultMessage='Linked Banks'
            />
          </div>
        </TopText>
      </Header>

      <AccountsListWrapper>
        {props.bankTransferAccounts.map(account => (
          <Bank
            key={account.id}
            bankDetails={account.details}
            text={account.details.bankName}
            isActive={account.id === props.account?.id}
            icon={getLinkedBankIcon(account.details.bankName)}
            onClick={() => {
              props.brokerageActions.setBankDetails({ account })
              props.brokerageActions.setDWStep({
                dwStep: BankDWStepType.ENTER_AMOUNT
              })
            }}
          />
        ))}
        {props.beneficiaries.map(beneficiary => (
          <BankWire
            beneficiary={beneficiary}
            minAmount={props.minAmount}
            onClick={() => {
              props.brokerageActions.setDWStep({
                dwStep: BankDWStepType.WIRE_INSTRUCTIONS
              })
            }}
            type={'DEPOSIT'}
          />
        ))}
        <AddNewButton
          data-e2e='DepositAddNewPaymentMethod'
          onClick={() => {
            // Setting addNew determines where the ach deposit method will link to
            props.brokerageActions.setDWStep({
              dwStep: BankDWStepType.DEPOSIT_METHODS,
              addNew: true
            })
          }}
        >
          <Text color='blue600' size='16px' weight={600}>
            <FormattedMessage id='buttons.add_new' defaultMessage='+ Add New' />
          </Text>
        </AddNewButton>
      </AccountsListWrapper>
    </Wrapper>
  )
}

export default BankList
