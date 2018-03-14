import React from 'react'
import styled from 'styled-components'

const isSelected = (props) => props.selection === props.id

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  color: ${props => isSelected(props) ? 'white' : props.theme['brand-primary']};
  background: ${props => isSelected(props) ? props.theme['brand-primary'] : 'white'};
`

const SelectBarOption = ({ id, onClick, ...rest }) => (
  <Wrapper {...rest} id={id} onClick={() => onClick(id)} />
)

export default SelectBarOption
