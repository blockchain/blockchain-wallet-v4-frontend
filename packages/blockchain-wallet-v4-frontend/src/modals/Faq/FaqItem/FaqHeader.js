import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-weight: 400;
  padding: 5px 0;
  font-size: 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  cursor: pointer;
  color: ${props => props.theme.grey700};
`

const Toggler = styled(Icon)`
  margin-left: 5px;
  margin-right: 10px;
`

const FaqHeader = props => (
  <Wrapper onClick={props.handleToggle}>
    {props.children}
    <Toggler
      name={props.toggled ? 'chevron-up' : 'chevron-down'}
      size='20px'
      cursor
      toggled={props.toggled}
    />
  </Wrapper>
)

FaqHeader.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired
}

export default FaqHeader
