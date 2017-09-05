import React from 'react'
import styled from 'styled-components'

const BaseGrid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;

  & > * {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    font-size: 30px!important;
  }
`
const Grid = props => {
  return (
    <BaseGrid>
      {props.children}
    </BaseGrid>
  )
}

export default Grid
