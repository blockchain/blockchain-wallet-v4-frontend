import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 20px;
`
const ScoreBar = styled.div`
  display: inline-flex;
  width: 20%;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid #FFFFFF;
  background-color: ${props =>
    props.score === 0 ? '#FFFFFF'
    : props.score === 1 ? '#660000'
    : props.score === 2 ? '#FF0000'
    : props.score === 3 ? '#E59400'
    : props.score === 4 ? '#E5E500' : '#006600'};
`
const PasswordGauge = (props) => {
  const { score } = props

  return (
    <Container>
      {score > 0 ? <ScoreBar score={score} /> : <ScoreBar score={0} />}
      {score > 1 ? <ScoreBar score={score} /> : <ScoreBar score={0} />}
      {score > 2 ? <ScoreBar score={score} /> : <ScoreBar score={0} />}
      {score > 3 ? <ScoreBar score={score} /> : <ScoreBar score={0} />}
      {score > 4 ? <ScoreBar score={score} /> : <ScoreBar score={0} />}
    </Container>
  )
}

PasswordGauge.propTypes = {
  score: PropTypes.number.isRequired
}

export default PasswordGauge
