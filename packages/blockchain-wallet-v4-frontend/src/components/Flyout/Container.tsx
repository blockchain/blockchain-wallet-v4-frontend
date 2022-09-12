import React, { memo } from 'react'
import styled from 'styled-components'

// exporting this in case you need to wrap FlyoutContainer in a styled component
export const Container = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`

const FlyoutContainer = memo((props: Props) => {
  return <Container>{props.children}</Container>
})

export type Props = {
  children: React.ReactNode
}

export default FlyoutContainer
