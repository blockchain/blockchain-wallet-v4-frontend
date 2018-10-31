import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme['white']};
  background-color: ${(props) => props.theme['brand-secondary']};
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 400;
  word-wrap: normal;
  padding: 4px 8px;
  box-sizing: border-box;
  border-radius: 4px;

  &:hover {
    color: ${(props) => props.theme['white']};
    background-color: ${(props) => props.theme['brand-secondary']};
  }
`

const Cartridge = ({ children, ...rest }) => (
  <Wrapper {...rest}>
    {children}
  </Wrapper>
)

export default Cartridge
