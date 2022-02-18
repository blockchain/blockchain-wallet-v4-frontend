import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Image } from 'blockchain-info-components'
import { Content, DisplayContainer, DisplayIcon, DisplayTitle } from 'components/BuySell'

const DisplayContainerApplePay = styled(DisplayContainer)`
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
`

type Props = {
  onClick: (string) => void
}

const ApplePay = ({ onClick }: Props) => (
  <DisplayContainerApplePay role='button' onClick={onClick}>
    <DisplayIcon>
      <Image name='apple-pay' height='18px' />
    </DisplayIcon>
    <Content>
      <DisplayTitle>
        <FormattedMessage id='modals.simplebuy.applepay' defaultMessage='Apple Pay' />
      </DisplayTitle>
    </Content>
  </DisplayContainerApplePay>
)

export default ApplePay
