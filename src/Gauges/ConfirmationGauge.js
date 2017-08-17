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
  border: 1px solid #000000;
  box-sizing: border-box;
`
const YellowBar = styled(Bar)`background-color: #E5E500;`
const OrangeBar = styled(Bar)`background-color: #E59400;`
const GreenBar = styled(Bar)`background-color: #006600;`
const EmptyBar = styled(Bar)`background-color: #FFFFFF;`

const ConfirmationGauge = (props) => {
  const { nbConfirmations } = props

  switch (nbConfirmations) {
    case 0: return <Container><EmptyBar /><EmptyBar /><EmptyBar /></Container>
    case 1: return <Container><OrangeBar /><EmptyBar /><EmptyBar /></Container>
    case 2: return <Container><YellowBar /><YellowBar /><EmptyBar /></Container>
    case 3: return <Container><GreenBar /><GreenBar /><GreenBar /></Container>
    default: return <div />
  }
}

ConfirmationGauge.defaultProps = {
  nbConfirmations: 0
}

ConfirmationGauge.propTypes = {
  nbConfirmations: PropTypes.number.isRequired
}

export default ConfirmationGauge
