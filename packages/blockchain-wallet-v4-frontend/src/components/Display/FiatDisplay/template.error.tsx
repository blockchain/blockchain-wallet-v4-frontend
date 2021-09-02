import React from 'react'
import styled from 'styled-components'

import { Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`
const ErrorText = styled(Text)<{ mobileSize?: string }>`
  font-weight: 800;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.grey200};
  font-size: ${(props) => props.mobileSize};
  ${media.atLeastMobile`
    font-size: ${(props) => props.size};
  `}
  span:last-child {
    margin-right: 0px;
  }
`

export default (props: Props) => (
  <Wrapper>
    <ErrorText weight={400} {...props}>
      <TooltipHost id='tooltip.rates_error'>
        {Currencies[props.userCurrency].units[props.userCurrency].symbol}--
        <TooltipIcon name='question-in-circle-filled' />
      </TooltipHost>
    </ErrorText>
  </Wrapper>
)

type Props = {
  userCurrency: string
}
