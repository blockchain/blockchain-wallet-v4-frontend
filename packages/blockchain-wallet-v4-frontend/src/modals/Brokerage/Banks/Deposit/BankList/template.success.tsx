import { FormattedMessage } from 'react-intl'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { AddNewButton } from 'components/Brokerage'
import { BankDWStepType } from 'data/types'
import { BankTransferAccountType, BeneficiaryType } from 'core/types'
import { FlyoutWrapper } from 'components/Flyout'
import { getBankLogoImageName } from 'services/ImagesService'
import { Icon, Image, Text } from 'blockchain-info-components'

import { Props as _P } from '.'

import Bank from './Accounts/Bank'

type OwnProps = {
  bankTransferAccounts: BankTransferAccountType[]
  beneficiaries: BeneficiaryType[]
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
            icon={getLinkedBankIcon(account.details.bankName)}
            onClick={() => {
              props.brokerageActions.setBankDetails({ account })
              props.brokerageActions.setDWStep({
                dwStep: BankDWStepType.ENTER_AMOUNT
              })
            }}
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
