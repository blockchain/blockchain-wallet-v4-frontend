import React, { memo } from 'react'
import styled from 'styled-components'

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
`

const FlyoutContent = (props: Props) => {
  return (
    <Content>
      {props.children}
    </Content>
  )
}

export type Props = {
  children: React.ReactNode
}

export default memo(FlyoutContent)
