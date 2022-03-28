import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

const ItemWrapper = styled.div`
  margin: 1em 0em;
  display: block;
  align-items: center;
  border-color: rgb(242, 153, 74);
  background: rgb(239 166 101);
  border-radius: 8px;
  padding: 1em;
`
const Title = styled.div`
  color: white;
  size: 24px;
  text-align: center;
  font-family: Inter, sans-serif;
`
const WorkInProgressComponent: React.FC<Props> = () => {
  return (
    <>
      <ItemWrapper>
        <Title>NFT BETA: Work in progress, you may notice some intermittent issues.</Title>
      </ItemWrapper>
    </>
  )
}

const connector = connect()

type Props = ConnectedProps<typeof connector>

export default connector(WorkInProgressComponent)
