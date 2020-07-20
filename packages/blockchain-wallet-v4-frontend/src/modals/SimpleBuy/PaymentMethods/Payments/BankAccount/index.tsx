import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import { SBPaymentMethodType } from 'core/types'
import { Title } from 'components/Flyout'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const DisplayContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: 16px 40px;
  flex-direction: row;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.grey000};
  &hover {
    background-color: ${props => props.theme.grey100};
  }
`
const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 16px;
  color: ${props => props.theme.grey800};
`
const DisplayIcon = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.grey800};
`
const DisplayTitle = styled(Title)`
  align-items: left;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.textBlack};
  width: 100%;
  margin-bottom: 2px;
`

type Props = {
  icon: ReactElement
  onClick: (string) => void
  text: string
  value: SBPaymentMethodType
}

const BankAccount: React.FC<Props> = ({ value, onClick, icon, text }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}BankAccount`}
    role='button'
    onClick={onClick}
  >
    <DisplayIcon>{icon}</DisplayIcon>
    <Content>
      <DisplayTitle>{text}</DisplayTitle>
      <Title>
        <FormattedMessage
          id='modals.simplebuy.depositcash_description'
          defaultMessage='Send funds directly from your bank to your Blockchain.com Wallet. Once we receive the manual transfer, use that cash to buy crypto.'
        />
      </Title>
    </Content>
    <Icon name='chevron-right' size='24px' color='grey400' />
  </DisplayContainer>
)

export default BankAccount
