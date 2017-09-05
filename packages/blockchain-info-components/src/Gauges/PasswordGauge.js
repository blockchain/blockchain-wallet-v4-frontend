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
const Bar = styled.div`
  display: inline-flex;
  width: 20%;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid ${props => props.theme['white']};
  background-color: ${props => props.theme[props.color]};
`

const selectColor = score => {
  switch (score) {
    case 1: return 'error'
    case 2: return 'red'
    case 3: return 'brand-yellow-lighter'
    case 4: return 'brand-yellow'
    case 5: return 'success'
    default: return 'white'
  }
}

const PasswordGauge = (props) => {
  const { score } = props
  const color = selectColor(score)

  return (
    <Container>
      {score > 0 ? <Bar color={color} /> : <Bar color='white' />}
      {score > 1 ? <Bar color={color} /> : <Bar color='white' />}
      {score > 2 ? <Bar color={color} /> : <Bar color='white' />}
      {score > 3 ? <Bar color={color} /> : <Bar color='white' />}
      {score > 4 ? <Bar color={color} /> : <Bar color='white' />}
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
