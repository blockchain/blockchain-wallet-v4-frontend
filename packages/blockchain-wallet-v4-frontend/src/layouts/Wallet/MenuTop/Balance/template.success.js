import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import TotalBalance from './TotalBalance'
import BitcoinBalance from './BitcoinBalance'
import EtherBalance from './EtherBalance'
import { SimpleDropdown } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & > * { margin-right: 5px; }

  @media(min-width: 850px) { align-items: flex-end; }
`

const Success = props => {
  const { bitcoinContext, etherContext, handleCoinDisplay } = props

  const getComponentOrder = () => {
    return [<BitcoinBalance context={bitcoinContext} />, <EtherBalance context={etherContext} />]
  }

  return (
    <Wrapper onClick={handleCoinDisplay}>
      <TotalBalance />
      <SimpleDropdown down items={getComponentOrder()} callback={console.log('')} />
    </Wrapper>
  )
}

Success.propTypes = {
  handleCoinDisplay: PropTypes.func.isRequired
}

export default Success
