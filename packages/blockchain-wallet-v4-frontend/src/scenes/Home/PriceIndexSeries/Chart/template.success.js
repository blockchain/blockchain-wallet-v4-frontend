import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'

const Wrapper = styled.div`
  width: 100%;
`

export default props => (
  <Wrapper>
    <ReactHighcharts config={props.config} isPureConfig />
  </Wrapper>
)
