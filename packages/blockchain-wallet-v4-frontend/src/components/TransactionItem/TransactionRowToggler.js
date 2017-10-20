import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  box-sizing: border-box;
  cursor: pointer;
  transform: ${props => !props.toggled ? 'rotate(-90deg)' : 'none'};
`

const TransactionRowToggler = props => (
  <Wrapper {...props}>
    <Icon name='down-arrow' size='16px' cursor />
  </Wrapper>
)

TransactionRowToggler.propTypes = {
  toggled: PropTypes.bool
}

TransactionRowToggler.defaultProps = {
  toggled: false
}

export default TransactionRowToggler
