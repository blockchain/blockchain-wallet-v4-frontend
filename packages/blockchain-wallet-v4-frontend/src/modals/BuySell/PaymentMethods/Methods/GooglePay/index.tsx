import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image } from 'blockchain-info-components'
import {
  Content,
  Description,
  DisplayContainer,
  DisplayIcon,
  DisplaySubTitle,
  DisplayTitle
} from 'components/BuySell'

const DisplayTitleGooglePay = styled(DisplayTitle)`
  margin-bottom: 2px;
`
const DisplayIconGooglePay = styled(DisplayIcon)`
  min-height: 60px;
`

type Props = {
  onClick: (string) => void
}

const GooglePay = ({ onClick }: Props) => (
  <DisplayContainer role='button' onClick={onClick}>
    <DisplayIconGooglePay>
      <Image name='google-pay' height='18px' />
    </DisplayIconGooglePay>
    <Content>
      <DisplayTitleGooglePay>
        <FormattedMessage id='modals.simplebuy.googlepay' defaultMessage='Google Pay' />
      </DisplayTitleGooglePay>
      <DisplaySubTitle>
        <FormattedMessage id='copy.instantly_available' defaultMessage='Instantly Available' />
      </DisplaySubTitle>
      <Description>
        <FormattedMessage
          id='modals.simplebuy.googlepay.description'
          defaultMessage='Simply tap Buy with Google Pay'
        />
      </Description>
    </Content>
    <Icon name='chevron-right' size='24px' color='grey400' />
  </DisplayContainer>
)

export default GooglePay
