import React from 'react'
import { FormattedMessage } from 'react-intl'
import { BlockchainLoader, Text } from 'blockchain-info-components'
import styled from 'styled-components'

interface Props {}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const Loading: React.FC<Props> = () => {
  return (
    <Wrapper>
      <BlockchainLoader width='80px' height='80px' />
      <Text weight={600} color='grey600' style={{ marginTop: '24px' }}>
        <FormattedMessage
          id='modals.simplebuy.processing'
          defaultMessage='Processing…'
        />
      </Text>
    </Wrapper>
  )
}

export default Loading
