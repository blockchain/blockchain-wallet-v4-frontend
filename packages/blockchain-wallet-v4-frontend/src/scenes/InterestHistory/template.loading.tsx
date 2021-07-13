import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { SpinningLoader, Text } from 'blockchain-info-components'
import { SceneWrapper } from 'components/Layout'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Loading = () => (
  <SceneWrapper centerContent>
    <Wrapper>
      <SpinningLoader width='36px' height='36px' />
      <Text size='18px' weight={600} color='grey600' style={{ marginTop: '16px' }}>
        <FormattedMessage id='modals.interest.withdrawal.loading' defaultMessage='Doing Work...' />
      </Text>
    </Wrapper>
  </SceneWrapper>
)

export default Loading
