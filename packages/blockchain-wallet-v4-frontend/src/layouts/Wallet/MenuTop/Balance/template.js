import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import SwitchableDisplay from 'components/Display/SwitchableDisplay'
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

const Actions = props => {
  const { bitcoinBalance, etherBalance, handleCoinDisplay } = props

  return (
    <Wrapper onClick={handleCoinDisplay}>
      <SwitchableDisplay coin='BTC' size='24px' weight={100} showIcon>{bitcoinBalance}</SwitchableDisplay>
      <Text weight={200} size='24px' >|</Text>
      <SwitchableDisplay coin='ETH' size='24px' weight={100} showIcon>{etherBalance}</SwitchableDisplay>
    </Wrapper>
  )
}

export default Actions
