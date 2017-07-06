import React from 'react'
import styled from 'styled-components'

const FilterStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`
const FilterStatusItem = styled.span`
  color: lighten(gray, 20%);
  text-decoration: none;
  text-transform: uppercase;
  font-weight: normal;
  cursor: pointer;
`
const FilterStatusItemSelected = styled.span`
  color: black;
  text-decoration: underline;
  text-transform: uppercase;
  font-weight: normal;
  cursor: pointer;
`

const FilterStatus = (props) => {
  return (
    <FilterStatusContainer>
      { props.items.map(function (item, index) {
        if (item.value === props.selected) {
          return <FilterStatusItemSelected key={index} onClick={() => props.callback(item.value)}>{item.text}</FilterStatusItemSelected>
        } else {
          return <FilterStatusItem key={index} onClick={() => props.callback(item.value)}>{item.text}</FilterStatusItem>
        }
      })}
    </FilterStatusContainer>
  )
}

export default FilterStatus
