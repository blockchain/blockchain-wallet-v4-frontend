import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SpinningLoader, Text } from 'blockchain-info-components'
import styled from 'styled-components'

import { FlyoutWrapper } from 'components/Flyout'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const Loading: React.FC = () => {
  return (
    <FlyoutWrapper>
      <Wrapper>
        <SpinningLoader />
        <Text weight={600} color='grey600' style={{ marginTop: '24px' }}>
          <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
        </Text>
      </Wrapper>
    </FlyoutWrapper>
  )
}

export default Loading
