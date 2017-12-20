import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'

const Wrapper = styled.div`
  width: 100%;
`

const Chart = (props) => {
  console.log(props)
  return (
    <Wrapper>
      <ReactHighcharts config={props.config} />
    </Wrapper>
  )
}

export default Chart
