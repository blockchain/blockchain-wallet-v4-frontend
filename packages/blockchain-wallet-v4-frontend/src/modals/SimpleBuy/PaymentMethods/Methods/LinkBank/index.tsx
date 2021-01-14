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

const LinkBank: React.FC<Props> = ({ value, onClick, icon }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}LinkBank`}
    role='button'
    onClick={onClick}
  >
    <DisplayIconBank>{icon}</DisplayIconBank>
    <Content>
      <DisplayTitleBank>
        <FormattedMessage
          id='modals.simplebuy.linkbank'
          defaultMessage='Link a Bank'
        />
      </DisplayTitleBank>
      <SubTitle>
        <FormattedMessage
          id='modals.simplebuy.linkbank.description'
          defaultMessage='Link your bank and instantly buy crypto at anytime.'
        />
      </SubTitle>
    </Content>
    <Icon name='chevron-right' size='24px' color='grey400' />
  </DisplayContainer>
)

export default LinkBank
