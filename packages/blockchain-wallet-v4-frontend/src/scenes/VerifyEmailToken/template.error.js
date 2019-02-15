import React from 'react'
import styled from 'styled-components'
import { Icon, Text } from 'blockchain-info-components'
import { FormattedHTMLMessage } from 'react-intl'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Error = props => {
  return (
    <Wrapper>
      <Icon name='alert-filled' color='red' size='40px' />
      <Text size='16px' weight={300} style={{ 'margin-top': '25px' }}>
        <FormattedHTMLMessage
          id='scenes.verifyemailtoken.error.uhoh'
          defaultMessage='Uh Oh. Something went wrong.'
          values={{ error: props.value }}
        />
      </Text>
      <Text style={{ marginTop: '10px' }} size='16px' color='red' weight={300}>
        <FormattedHTMLMessage
          id='scenes.verifyemailtoken.error.msg'
          defaultMessage='Error: {error}'
          values={{ error: props.value }}
        />
      </Text>
    </Wrapper>
  )
}

export default Error
