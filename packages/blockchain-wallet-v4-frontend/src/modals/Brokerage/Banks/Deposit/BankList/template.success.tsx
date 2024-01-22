import React, { ReactElement, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BeneficiaryType } from '@core/types'
import { Icon, Image, Text } from 'blockchain-info-components'
import { AddNewButton } from 'components/Brokerage'
import { FlyoutWrapper } from 'components/Flyout'
import { Bank, BankWire } from 'components/Flyout/model'
import { BankDWStepType, BankTransferAccountType } from 'data/types'
import { getBankLogoImageName } from 'services/images'

import { Props as _P } from '.'

type OwnProps = {
  account: BankTransferAccountType | undefined
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
  border-top: 1px solid ${(props) => props.theme.grey000};
`

const getLinkedBankIcon = (bankName: string): ReactElement => (
  <Image name={getBankLogoImageName(bankName)} height='48px' />
)

const BankList = (props: Props) => {
  const bankTransferAccounts = useMemo(
    () => props.bankTransferAccounts.filter((account) => account.currency === props.fiatCurrency),
    [props.bankTransferAccounts, props.fiatCurrency]
  )
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
            <FormattedMessage id='scenes.settings.linked_banks' defaultMessage='Linked Banks' />
          </div>
        </TopText>
      </Header>

      <AccountsListWrapper>
        {bankTransferAccounts.map((account) => (
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
        {props.beneficiaries.map((beneficiary) => (
          <BankWire
            key={beneficiary.id}
            beneficiary={beneficiary}
            onClick={() => {
              props.brokerageActions.setDWStep({
                dwStep: BankDWStepType.WIRE_INSTRUCTIONS
              })
            }}
            type='DEPOSIT'
          />
        ))}
        <AddNewButton
          data-e2e='DepositAddNewPaymentMethod'
          onClick={() => {
            // Setting addNew determines where the ach deposit method will link to
            props.brokerageActions.setDWStep({
              addNew: true,
              dwStep: BankDWStepType.DEPOSIT_METHODS
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
