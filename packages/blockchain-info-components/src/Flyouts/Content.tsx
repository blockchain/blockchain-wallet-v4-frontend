import React, { memo } from 'react'
import styled from 'styled-components'

const Content = styled.div<{ mode: Props['mode'] }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: ${(p) =>
    p.mode === 'top' ? 'flex-start' : p.mode === 'middle' ? 'space-around' : 'space-between'};
  ${(p) => p.mode === 'middle' && 'align-items: center;'}
`

const FlyoutContent = (props: Props) => {
  return <Content mode={props.mode}>{props.children}</Content>
}

export type Props = {
  children: React.ReactNode
  mode: 'top' | 'middle'
}

export default memo(FlyoutContent)
