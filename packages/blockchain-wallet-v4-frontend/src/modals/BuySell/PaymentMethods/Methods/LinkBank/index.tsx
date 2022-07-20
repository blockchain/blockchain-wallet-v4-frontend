import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BSPaymentMethodType } from '@core/types'
import { Icon } from 'blockchain-info-components'
import {
  Content,
  Description,
  DisplayContainer,
  DisplayIcon,
  DisplaySubTitle,
  DisplayTitle
} from 'components/BuySell'

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
  value: BSPaymentMethodType
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
          id='modals.simplebuy.easybanktransfer'
          defaultMessage='Easy Bank Transfer'
        />
      </DisplayTitleBank>
      <DisplaySubTitle>
        <FormattedMessage id='copy.buy_large_amounts' defaultMessage='Buy Large Amounts' />
      </DisplaySubTitle>
      <Description>
        <FormattedMessage
          id='modals.simplebuy.linkbank.description'
          defaultMessage='Quick and secure without entering account details'
        />
      </Description>
    </Content>
    <Icon name='chevron-right' size='24px' color='grey400' />
  </DisplayContainer>
)

export default LinkBank
