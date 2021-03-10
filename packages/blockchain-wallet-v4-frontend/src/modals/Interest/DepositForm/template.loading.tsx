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

const Loading: React.FC<{}> = () => {
  return (
    <Wrapper>
      <SpinningLoader />
      <Text weight={600} color='grey800' style={{ marginTop: '24px' }}>
        <FormattedMessage
          id='modals.interest.loading.doingwork'
          defaultMessage='Doing Work...'
        />
      </Text>
    </Wrapper>
  )
}

export default Loading
