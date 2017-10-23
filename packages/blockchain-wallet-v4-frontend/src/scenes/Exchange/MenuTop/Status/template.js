import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Item = styled.span`
  padding: 10px;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: normal;
  cursor: pointer;
  color: ${props => props.theme['gray-3']};
  text-align: center;
`
const ItemSelected = styled.span`
  padding: 10px;
  text-decoration: underline;
  text-transform: uppercase;
  font-weight: normal;
  cursor: pointer;
  color: ${props => props.theme['gray-6']};
  text-align: center;
`

const Status = (props) => {
  const { value, handleChange, items } = props

  return (
    <Container>
      {items.map(function (item, index) {
        if (item.value === value) {
          return <ItemSelected key={index} onClick={() => handleChange(item.value)}>{item.text}</ItemSelected>
        } else {
          return <Item key={index} onClick={() => handleChange(item.value)}>{item.text}</Item>
        }
      })}
    </Container>
  )
}

export default Status
