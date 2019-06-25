import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 3px;
  bottom: 0;
  left: 0;
`
const Bar = styled.div`
  display: inline-flex;
  width: 20%;
  height: 100%;
  box-sizing: border-box;
  background-color: ${props => props.theme[props.color]};
`

const selectColor = score => {
  switch (score) {
    case 1:
      return 'error'
    case 2:
      return 'red'
    case 3:
      return 'brand-yellow-lighter'
    case 4:
      return 'brand-yellow'
    case 5:
      return 'success'
    default:
      return 'transparent'
  }
}

const PasswordGauge = props => {
  const { score } = props
  const color = selectColor(score)

  return (
    <Container>
      {score > 0 ? <Bar color={color} /> : <Bar color='transparent' />}
      {score > 1 ? <Bar color={color} /> : <Bar color='transparent' />}
      {score > 2 ? <Bar color={color} /> : <Bar color='transparent' />}
      {score > 3 ? <Bar color={color} /> : <Bar color='transparent' />}
      {score > 4 ? <Bar color={color} /> : <Bar color='transparent' />}
    </Container>
  )
}

PasswordGauge.propTypes = {
  score: PropTypes.oneOf([0, 1, 2, 3, 4, 5]).isRequired
}

PasswordGauge.defaultProps = {
  score: 0
}

export default PasswordGauge
