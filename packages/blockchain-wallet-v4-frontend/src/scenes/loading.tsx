import { FormattedMessage } from 'react-intl'
import { SpinningLoader, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

interface Props {}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.blue000};
`

const Loading: React.FC<Props> = () => {
  return (
    <Wrapper>
      <SpinningLoader height='36px' width='36px' />
      <Text
        size='18px'
        weight={600}
        color='grey700'
        style={{ marginTop: '16px' }}
      >
        <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
      </Text>
    </Wrapper>
  )
}

export default Loading
