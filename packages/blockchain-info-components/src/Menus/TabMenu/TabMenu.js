import React from 'react'
import styled from 'styled-components'

const BaseTabMenu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

const TabMenu = props => {
  const { children } = props

  return <BaseTabMenu>{children}</BaseTabMenu>
}

export default TabMenu
