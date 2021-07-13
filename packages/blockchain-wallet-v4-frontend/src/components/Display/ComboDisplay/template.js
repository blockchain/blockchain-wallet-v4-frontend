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
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 5px;
`

const ComboDisplay = props => {
  return (
    <Wrapper>
      <CoinDisplay {...props} />
      <Container>
        <Text weight={400}>(</Text>
        <FiatDisplay {...props} />
        <Text weight={400}>)</Text>
      </Container>
    </Wrapper>
  )
}

ComboDisplay.propTypes = {
  coin: PropTypes.string.isRequired
}

export default ComboDisplay
