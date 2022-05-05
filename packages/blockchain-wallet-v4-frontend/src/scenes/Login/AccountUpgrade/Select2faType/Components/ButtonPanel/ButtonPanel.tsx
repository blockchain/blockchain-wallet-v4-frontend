import React from 'react'
import styled from 'styled-components'

const ClickablePanelWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 0.5rem;
  padding: 1.5rem 1.125rem;
  margin: 1.5rem 0 0;
  cursor: pointer;
  position: relative;
  align-items: center;
`

const ButtonPanel = ({ children, ...rest }) => {
  return <ClickablePanelWrapper {...rest}>{children}</ClickablePanelWrapper>
}

export default ButtonPanel
