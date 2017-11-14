import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const ComboDisplay = props => {
  return (
    <Wrapper>
      <CoinDisplay {...props} />
      <Text>(</Text>
      <FiatDisplay {...props} />
      <Text>)</Text>
    </Wrapper>
  )
}

ComboDisplay.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired,
  children: PropTypes.string.isRequired
}

export default ComboDisplay
