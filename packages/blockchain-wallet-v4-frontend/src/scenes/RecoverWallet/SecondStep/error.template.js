import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

const Body = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Error = (props) => {
  return (
    <Wrapper>
      <Body>
        <Icon color='error' name='close-circle' size='40px' />
        <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
          <FormattedMessage
            id='scenes.recover.restore_fails'
            defaultMessage='Restoring Account Failed'
          />
        </Text>
        <Text
          color='blue600'
          size='16px'
          weight={500}
          cursor='pointer'
          onClick={props.previousStep}
        >
          <FormattedMessage id='scenes.exchange.exchangeform.tryagain' defaultMessage='Try Again' />
        </Text>
      </Body>
    </Wrapper>
  )
}

export default Error
