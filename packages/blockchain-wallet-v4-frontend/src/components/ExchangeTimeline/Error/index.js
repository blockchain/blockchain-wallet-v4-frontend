import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: ${props => props.theme['white']};

  & > :first-child { margin-bottom 20px; }
  & > :last-child { height: 40px; }
`
const Circle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: 1px solid ${props => props.theme['error']};
  box-sizing: border-box;
  overflow: hidden;
`

const Error = props => (
  <Wrapper>
    <Circle>
      <Icon name='alert-filled' size='40px' color='error' />
    </Circle>
    <TextGroup inline>
      <Text size='13px' weight={300}>
        <FormattedMessage id='components.exchangetimeline.error.failed' defaultMessage='This trade has failed.' />
      </Text>
      <Text size='13px' weight={300}>
        <FormattedMessage id='components.exchangetimeline.error.failed2' defaultMessage='Any funds broadcast from your wallet will be returned minus the transaction fee.' />
      </Text>
      <Text size='13px' weight={300}>
        <FormattedMessage id='components.exchangetimeline.error.failed3' defaultMessage='Please return to the transaction tab to start a new trade' />
      </Text>
    </TextGroup>
  </Wrapper>
)

export default Error
