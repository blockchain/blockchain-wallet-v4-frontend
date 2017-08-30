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
const Bar = styled.div`
  display: inline-flex;
  width: 20%;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid ${DefaultColor.white};
  background-color: ${props =>
    props.score === 0 ? DefaultColor.white
    : props.score === 1 ? DefaultColor.invalidred
    : props.score === 2 ? DefaultColor.red
    : props.score === 3 ? DefaultColor.orange
    : props.score === 4 ? DefaultColor.yellow : DefaultColor.green};
`
const PasswordGauge = (props) => {
  const { score } = props

  return (
    <Container>
      {score > 0 ? <Bar score={score} /> : <Bar score={0} />}
      {score > 1 ? <Bar score={score} /> : <Bar score={0} />}
      {score > 2 ? <Bar score={score} /> : <Bar score={0} />}
      {score > 3 ? <Bar score={score} /> : <Bar score={0} />}
      {score > 4 ? <Bar score={score} /> : <Bar score={0} />}
    </Container>
  )
}

PasswordGauge.propTypes = {
  score: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired
}

PasswordGauge.defaultProps = {
  score: 0
}

export default PasswordGauge
