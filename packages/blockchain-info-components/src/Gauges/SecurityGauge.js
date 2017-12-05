import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  width: 52px;
  height: 8px;
  margin-left: 10px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme['gray-2']};
`
const Bar = styled.div`
  overflow: hidden;
  display: inline-flex;
  width: 15%;
  height: 100%;
  background-color: ${props => props.theme[props.color]};
`

const selectColor = score => {
  switch (score) {
    case 0: return 'error'
    case 1: return 'error'
    case 2: return 'red'
    case 3: return 'brand-yellow'
    case 4: return 'brand-yellow'
    case 5: return 'brand-yellow'
    case 6: return 'success'
    default: return 'white'
  }
}

const SecurityGauge = (props) => {
  const { score } = props
  const color = selectColor(score)

  const values = [0, 1, 2, 3, 4, 5, 6]

  return (
    <Container>
      {values.map(value => score >= value ? <Bar color={color} key={value} /> : <Bar color='gray-1' key={value} />)}
    </Container>
  )
}

SecurityGauge.propTypes = {
  score: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]).isRequired
}

SecurityGauge.defaultProps = {
  score: 0
}

export default SecurityGauge
