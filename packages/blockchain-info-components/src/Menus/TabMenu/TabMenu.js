import React from 'react'
import styled from 'styled-components'

const BaseTabMenu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 8px;
  background-color: ${props => props.theme.grey000};
`

const TabMenu = props => {
  const { children } = props

  return <BaseTabMenu {...props}>{children}</BaseTabMenu>
}

export default TabMenu
