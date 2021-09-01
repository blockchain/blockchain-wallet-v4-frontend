import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`
const ErrorText = styled(Text)<{ mobileSize: string }>`
  font-weight: 500;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.red600};
  font-size: ${(props) => props.mobileSize};
  ${media.atLeastMobile`
  font-size: ${(props) => props.size};
  `}
`

export default (props) => (
  <Wrapper>
    <ErrorText weight={400} {...props}>
      <SkeletonRectangle width='50px' height='14px' />
      <TooltipHost id='tooltip.rates_error'>
        <TooltipIcon name='question-in-circle-filled' />
      </TooltipHost>
    </ErrorText>
  </Wrapper>
)
