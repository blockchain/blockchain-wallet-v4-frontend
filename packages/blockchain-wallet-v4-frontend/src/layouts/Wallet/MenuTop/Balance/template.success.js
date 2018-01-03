import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import BitcoinBalance from './BitcoinBalance'
import EtherBalance from './EtherBalance'
import { Text } from 'blockchain-info-components'

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
  const { etherContext, handleCoinDisplay } = props

  return (
    <Wrapper onClick={handleCoinDisplay}>
      {/* <BitcoinBalance /> */}
      <Text weight={200} size='24px' >|</Text>
      <EtherBalance context={etherContext} />
    </Wrapper>
  )
}

Success.propTypes = {
  handleCoinDisplay: PropTypes.func.isRequired
}

export default Success
