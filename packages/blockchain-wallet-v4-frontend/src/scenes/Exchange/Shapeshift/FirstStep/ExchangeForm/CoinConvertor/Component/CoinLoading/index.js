import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { HeartbeatLoader, Icon } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`

const CoinLoading = props => (
  <Wrapper>
    {!props.loading
      ? <Icon name='right-arrow' size='24px' />
      : <HeartbeatLoader />
    }
  </Wrapper>
)

CoinLoading.defaultProps = {
  loading: PropTypes.bool.isRequired
}

CoinLoading.propTypes = {
  loading: false
}

export default CoinLoading
