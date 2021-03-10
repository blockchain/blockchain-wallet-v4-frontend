import React from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`
const ErrorText = styled(Text)`
  > span > span {
    color: ${props => props.theme.grey700};
  }
`

const Error = props => {
  return (
    <Wrapper>
      <Icon name='alert-filled' color='red600' size='40px' />
      <ErrorText
        size='16px'
        weight={400}
        color='red600'
        style={{ 'margin-top': '25px' }}
      >
        <FormattedHTMLMessage
          id='scenes.reset2fatoken.error1'
          defaultMessage='Uh Oh. Something went wrong. Error: {error}'
          values={{ error: props.value }}
        />
      </ErrorText>
    </Wrapper>
  )
}

export default Error
