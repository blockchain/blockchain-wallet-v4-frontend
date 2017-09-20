import React from 'react'
import styled from 'styled-components'
import ReactHighstock from 'react-highcharts/reactHighstock'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};

  & > * { padding: 10px 0; }
`

const Chart = (props) => {
  const { config } = props

  return (
    <Wrapper>
      <ReactHighstock config={config} />
    </Wrapper>
  )
}

export default Chart
