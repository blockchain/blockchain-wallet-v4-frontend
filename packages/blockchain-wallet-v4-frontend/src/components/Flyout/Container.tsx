import React, { memo } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`

const FlyoutContainer = (props: Props) => {
  return <Container>{props.children}</Container>
}

export type Props = {
  children: React.ReactNode
}

export default memo(FlyoutContainer)
