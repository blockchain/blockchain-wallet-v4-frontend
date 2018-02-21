import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import ExchangeForm from './ExchangeForm'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -18px;
  right: 0;
  height: 15px;
`

// const getErrorState = (meta) => {
//   return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
// }

const Success = props => <ExchangeForm {...this.props} />

Success.propTypes = {
  coinSource: PropTypes.string.isRequired,
  coinTarget: PropTypes.string.isRequired,
  coinSourceValue: PropTypes.string.isRequired,
  coinTargetValue: PropTypes.string.isRequired,
  coinSourceUnit: PropTypes.string.isRequired,
  coinTargetUnit: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  btcRates: PropTypes.object.isRequired,
  ethRates: PropTypes.object.isRequired,
  handleChangeCoinSource: PropTypes.func.isRequired,
  handleChangeCoinTarget: PropTypes.func.isRequired
}

export default Success
