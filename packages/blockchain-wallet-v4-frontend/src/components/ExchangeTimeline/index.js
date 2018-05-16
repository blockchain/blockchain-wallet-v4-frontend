import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { calculateAnimation } from './services'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Line from './Line'
import Error from './Error'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const RowLine = styled.div`
  position: absolute;
  top: 35%;
  left: 20%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 60%;
`

const ExchangeTimeline = props => {
  const { step1, line1, step2, line2, step3 } = calculateAnimation(props.status)

  return props.status !== 'failed' ? (
    <Wrapper>
      <Row>
        <Step1 status={step1} />
        <Step2 status={step2} />
        <Step3 status={step3} />
      </Row>
      <RowLine>
        <Line status={line1} />
        <Line status={line2} />
      </RowLine>
    </Wrapper>
  ) : (
    <Wrapper>
      <Row>
        <Error />
      </Row>
    </Wrapper>
  )
}

ExchangeTimeline.propTypes = {
  status: PropTypes.oneOf(['no_deposits', 'received', 'resolved', 'complete', 'failed'])
}

ExchangeTimeline.defaultProps = {
  status: 'no_deposits'
}

export default ExchangeTimeline
