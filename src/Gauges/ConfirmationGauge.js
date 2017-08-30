import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DefaultColor } from '../Colors'

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
  border: 1px solid ${DefaultColor.realblack};
  box-sizing: border-box;
  background-color: ${props =>
    props.score === 0 ? DefaultColor.white
  : props.score === 1 ? DefaultColor.yellow
  : props.score === 2 ? DefaultColor.orange : DefaultColor.green};
`

const ConfirmationGauge = (props) => {
  const { nbConfirmations } = props

  return (
    <Container>
      {nbConfirmations > 0 ? <Bar score={nbConfirmations} /> : <Bar score={0} />}
      {nbConfirmations > 1 ? <Bar score={nbConfirmations} /> : <Bar score={0} />}
      {nbConfirmations > 2 ? <Bar score={nbConfirmations} /> : <Bar score={0} />}
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
