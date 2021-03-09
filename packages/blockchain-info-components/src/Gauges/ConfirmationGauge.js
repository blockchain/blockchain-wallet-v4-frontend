import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 300px;
`
const Bar = styled.div`
  display: flex;
  flex-grow: 1;
  height: 15px;
  border: 1px solid ${props => props.theme.black};
  box-sizing: border-box;
  background-color: ${props => props.theme[props.color]};
`

const selectColor = nbConfirmations => {
  switch (nbConfirmations) {
    case 1:
      return 'brand-yellow-lighter'
    case 2:
      return 'brand-yellow'
    case 3:
      return 'success'
    default:
      return 'white'
  }
}

const ConfirmationGauge = props => {
  const { nbConfirmations } = props
  const color = selectColor(nbConfirmations)

  return (
    <Container>
      {nbConfirmations > 0 ? <Bar color={color} /> : <Bar color='white' />}
      {nbConfirmations > 1 ? <Bar color={color} /> : <Bar color='white' />}
      {nbConfirmations > 2 ? <Bar color={color} /> : <Bar color='white' />}
    </Container>
  )
}

ConfirmationGauge.defaultProps = {
  nbConfirmations: 0
}

ConfirmationGauge.propTypes = {
  nbConfirmations: PropTypes.number.isRequired
}

export default ConfirmationGauge
