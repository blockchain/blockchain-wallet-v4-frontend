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
  color: #CDCDCD;
  text-align: center;
`
const ItemSelected = styled.span`
  padding: 10px;
  color: black;
  text-decoration: underline;
  text-transform: uppercase;
  font-weight: normal;
  cursor: pointer;
  text-align: center;
`

const Status = (props) => {
  return (
    <Container>
      { props.items.map(function (item, index) {
        if (item.value === props.selected) {
          return <ItemSelected key={index} onClick={() => props.callback(item.value)}>{item.text}</ItemSelected>
        } else {
          return <Item key={index} onClick={() => props.callback(item.value)}>{item.text}</Item>
        }
      })}
    </Container>
  )
}

export default Status
