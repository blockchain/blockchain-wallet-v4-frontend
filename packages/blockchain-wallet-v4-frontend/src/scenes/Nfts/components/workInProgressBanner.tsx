import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const ItemWrapper = styled.div`
  margin: 1em 0em;
  display: block;
  align-items: center;
  background: ${(props) => props.theme.orange500};
  border-radius: 8px;
  padding: 1em;
`
const TitleText = styled(Text)``
const WorkInProgressComponent: React.FC<Props> = () => {
  return (
    <>
      <ItemWrapper>
        <TitleText
          style={{
            fontFamily: 'Inter',
            marginBottom: '1px'
          }}
          color='white'
          size='16px'
          weight={600}
        >
          NFT BETA: Work in progress, you may notice some intermittent issues.
        </TitleText>
      </ItemWrapper>
    </>
  )
}

const connector = connect()

type Props = ConnectedProps<typeof connector>

export default connector(WorkInProgressComponent)
