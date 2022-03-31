import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Image } from 'blockchain-info-components'
import { Content, DisplayContainer, DisplayIcon, DisplayTitle } from 'components/BuySell'

const DisplayContainerGooglePay = styled(DisplayContainer)`
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
`

type Props = {
  onClick: (string) => void
}

const GooglePay = ({ onClick }: Props) => (
  <DisplayContainerGooglePay role='button' onClick={onClick}>
    <DisplayIcon>
      <Image name='google-pay' height='18px' />
    </DisplayIcon>
    <Content>
      <DisplayTitle>
        <FormattedMessage id='modals.simplebuy.googlepay' defaultMessage='Google Pay' />
      </DisplayTitle>
    </Content>
  </DisplayContainerGooglePay>
)

export default GooglePay
