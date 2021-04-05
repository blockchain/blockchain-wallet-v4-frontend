import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
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
  color: ${props => props.theme.red600};
  font-size: ${props => props.mobileSize};
  ${media.atLeastMobile`
  font-size: ${props => props.size};
  `}
`

export default props => (
  <Wrapper>
    <ErrorText weight={400} {...props}>
      <FormattedMessage
        id='components.fiatdisplay.error'
        defaultMessage='Failed to fetch rates'
      />
    </ErrorText>
  </Wrapper>
)
