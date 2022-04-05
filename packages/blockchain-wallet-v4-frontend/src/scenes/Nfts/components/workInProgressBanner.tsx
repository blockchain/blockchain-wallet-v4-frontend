import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const ItemWrapper = styled.div`
  margin: 1em 0em;
  display: block;
  align-items: center;
  background: ${(props) => props.theme.orange400};
  border-radius: 8px;
  padding: 1em;
`
const TitleText = styled(Text)`
  text-align: center;
`
const WorkInProgressComponent: React.FC<Props> = () => {
  return (
    <>
      <ItemWrapper>
        <TitleText size='18px' color='white'>
          NFT BETA: Work in progress, you may notice some intermittent issues.
        </TitleText>
      </ItemWrapper>
    </>
  )
}

const connector = connect()

type Props = ConnectedProps<typeof connector>

export default connector(WorkInProgressComponent)
