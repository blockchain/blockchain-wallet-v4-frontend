import { FormattedMessage } from 'react-intl'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import {
  Content,
  DisplayContainer,
  DisplayIcon,
  DisplayTitle
} from 'components/SimpleBuy'
import { Icon } from 'blockchain-info-components'
import { SBPaymentMethodType } from 'core/types'
import { Title } from 'components/Flyout'

const DisplayTitleBank = styled(DisplayTitle)`
  margin-bottom: 2px;
`
const DisplayIconBank = styled(DisplayIcon)`
  min-height: 75px;
`
const SubTitle = styled(Title)`
  color: ${props => props.theme.grey600};
  margin-top: 5px;
  line-height: 21px;
`

type Props = {
  icon: ReactElement
  onClick: (string) => void
  text: ReactElement | string
  value: SBPaymentMethodType
}

const BankWire: React.FC<Props> = ({ value, onClick, icon, text }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}BankWire`}
    role='button'
    onClick={onClick}
  >
    <DisplayIconBank>{icon}</DisplayIconBank>
    <Content>
      <DisplayTitleBank>{text}</DisplayTitleBank>
      <SubTitle>
        <FormattedMessage
          id='modals.simplebuy.bankwire.description'
          defaultMessage='Send funds directly from your bank account to your Blockchain.com wallet.'
        />
      </SubTitle>
    </Content>
    <Icon name='chevron-right' size='24px' color='grey400' />
  </DisplayContainer>
)

export default BankWire
