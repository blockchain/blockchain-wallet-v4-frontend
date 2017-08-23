import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DefaultColor } from '../Colors'

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
  border: 2px solid ${DefaultColor.white};
  background-color: ${props =>
    props.score === 0 ? DefaultColor.white
    : props.score === 1 ? DefaultColor.invalidredwine
    : props.score === 2 ? DefaultColor.red
    : props.score === 3 ? DefaultColor.orange
    : props.score === 4 ? DefaultColor.yellow : DefaultColor.green};
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
