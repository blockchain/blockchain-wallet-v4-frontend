import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 52px;
  height: 10px;
  background-color: ${props => props.theme['gray-1']};
  box-shadow: ${props => props.theme['gray-2']} 10px;
  border-radius: 100%;
  
  & > :first-child {
    border-radius: 100% 0% 0% 100%;
  }

  & > :last-child {
    border-radius: 0% 100% 100% 0%;
  }
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
    case 1: return 'error'
    case 2: return 'red'
    case 3: return 'brand-yellow-lighter'
    case 4: return 'brand-yellow'
    case 5: return 'success'
    default: return 'white'
  }
}

const SecurityGauge = (props) => {
  const { score } = props
  const color = selectColor(score)

  return (
    <Container>
      {score > 0 ? <Bar color={color} /> : <Bar color='gray-1' />}
      {score > 1 ? <Bar color={color} /> : <Bar color='gray-1' />}
      {score > 2 ? <Bar color={color} /> : <Bar color='gray-1' />}
      {score > 3 ? <Bar color={color} /> : <Bar color='gray-1' />}
      {score > 4 ? <Bar color={color} /> : <Bar color='gray-1' />}
    </Container>
  )
}

SecurityGauge.propTypes = {
  score: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired
}

SecurityGauge.defaultProps = {
  score: 0
}

export default SecurityGauge
