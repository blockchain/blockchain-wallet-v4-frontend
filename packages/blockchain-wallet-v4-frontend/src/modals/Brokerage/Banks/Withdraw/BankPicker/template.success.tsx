import { FormattedMessage } from 'react-intl'
import { Icon, Image, Text } from 'blockchain-info-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { AddNewButton } from 'components/Brokerage'
import { Col, FlyoutWrapper, Title, Value } from 'components/Flyout'
import {
  Content,
  DisplayContainer,
  DisplayPaymentIcon
} from 'components/SimpleBuy'
import { getBankLogoImageName } from 'services/ImagesService'
import { Props as OwnProps, SuccessStateType } from '.'
import Bank from '../../Deposit/BankList/Accounts/Bank'

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
                step: 'ENTER_AMOUNT',
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
                step: 'ENTER_AMOUNT'
              })
            }}
          />
        )
      })}
      {props.beneficiaries.map(beneficiary => {
        return (
          <DisplayContainer
            onClick={() => {
              props.brokerageActions.setBankDetails({ account: undefined })
              props.withdrawActions.setStep({
                beneficiary,
                fiatCurrency: props.fiatCurrency,
                step: 'ENTER_AMOUNT'
              })
            }}
          >
            <Col>
              <DisplayPaymentIcon showBackground>
                <Icon name='bank-filled' color='blue600' size='16px' />
              </DisplayPaymentIcon>
            </Col>
            <Col style={{ width: '100%' }}>
              <Content>
                <Value asTitle>{beneficiary.name}</Value>
                <Title asValue>{beneficiary.agent.account}</Title>
              </Content>
            </Col>
            {props.beneficiary?.id === beneficiary.id ? (
              <Icon
                name='checkmark-circle-filled'
                size='24px'
                color='green600'
                role='button'
                style={{ justifyContent: 'flex-start' }}
              />
            ) : (
              <Image
                name='circle-empty'
                width='24px'
                height='24px'
                style={{ justifyContent: 'flex-start' }}
              />
            )}
          </DisplayContainer>
        )
      })}
      <AddNewButton
        data-e2e='DepositAddNewPaymentMethod'
        onClick={() => {
          props.withdrawActions.setStep({
            fiatCurrency: props.fiatCurrency,
            step: 'WITHDRAWAL_METHODS'
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
