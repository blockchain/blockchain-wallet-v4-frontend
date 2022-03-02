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

const DisplayTitleApplePay = styled(DisplayTitle)`
  margin-bottom: 2px;
`
const DisplayIconApplePay = styled(DisplayIcon)`
  min-height: 60px;
`

type Props = {
  onClick: (string) => void
}

const ApplePay = ({ onClick }: Props) => (
  <DisplayContainer role='button' onClick={onClick}>
    <DisplayIconApplePay>
      <Image name='apple-pay' height='18px' />
    </DisplayIconApplePay>
    <Content>
      <DisplayTitleApplePay>
        <FormattedMessage id='modals.simplebuy.applepay' defaultMessage='Apple Pay' />
      </DisplayTitleApplePay>
      <DisplaySubTitle>
        <FormattedMessage id='copy.instantly_available' defaultMessage='Instantly Available' />
      </DisplaySubTitle>
      <Description>
        <FormattedMessage
          id='modals.simplebuy.applepay.description'
          defaultMessage='Simply tap Buy with Apple Pay'
        />
      </Description>
    </Content>
    <Icon name='chevron-right' size='24px' color='grey400' />
  </DisplayContainer>
)

export default ApplePay
