import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { SpinningLoader, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const Loading = () => {
  return (
    <Wrapper>
      <SpinningLoader />
      <Text weight={600} color='grey600' style={{ marginTop: '24px' }}>
        <FormattedMessage id='loader.message.gettingready' defaultMessage='Getting Ready...' />
      </Text>
    </Wrapper>
  )
}

export default Loading
