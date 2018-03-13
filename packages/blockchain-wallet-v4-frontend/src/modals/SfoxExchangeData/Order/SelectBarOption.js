import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  color: ${props => props.selection === props.id ? 'white' : props.theme['brand-primary']};
  background: ${props => props.selection === props.id ? props.theme['brand-primary'] : 'white'};
`

const SelectBarOption = ({ id, onClick, ...rest }) => (
  <Wrapper {...rest} id={id} onClick={() => onClick(id)} />
)

export default SelectBarOption
