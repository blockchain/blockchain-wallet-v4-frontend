import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import { SBPaymentMethodType } from 'blockchain-wallet-v4/src/types'
import {
  Content,
  Description,
  DisplayContainer,
  DisplayIcon,
  DisplaySubTitle,
  DisplayTitle
} from 'components/SimpleBuy'

const DisplayTitleBank = styled(DisplayTitle)`
  margin-bottom: 2px;
`
const DisplayIconBank = styled(DisplayIcon)`
  min-height: 75px;
`

type Props = {
  icon: ReactElement
  onClick: (string) => void
  text: ReactElement | string
  value: SBPaymentMethodType
}

const LinkBank: React.FC<Props> = ({ icon, onClick, value }) => (
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
      <DisplaySubTitle>
        <FormattedMessage
          id='copy.instantly_available'
          defaultMessage='Instantly Available'
        />
      </DisplaySubTitle>
      <Description>
        <FormattedMessage
          id='modals.simplebuy.linkbank.description'
          defaultMessage='Link your bank and instantly buy crypto at anytime.'
        />
      </Description>
    </Content>
    <Icon name='chevron-right' size='24px' color='grey400' />
  </DisplayContainer>
)

export default LinkBank
