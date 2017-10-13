import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: auto;
`
const Item = styled.span`
  display: block;
  padding: 10px;
  text-decoration: ${props => props.selected ? 'underline' : 'none'};
  text-transform: uppercase;
  font-weight: normal;
  cursor: pointer;
  color: ${props => props.selected ? props.theme['gray-5'] : props.theme['gray-3']};
  text-align: center;
  flex: 1;
`

const Status = (props) => {
  const { value, handleChange, items } = props

  return (
    <Container>
      {items.map((item, index) => <Item key={index} selected={item.value === value} onClick={() => handleChange(item.value)}>{item.text}</Item>)}
    </Container>
  )
}

export default Status
