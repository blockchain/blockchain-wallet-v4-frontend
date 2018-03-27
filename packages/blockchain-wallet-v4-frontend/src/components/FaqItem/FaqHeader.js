import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  font-size: 14px;
  font-family: 'Montserrat', Helvetica, sans-serif;
  cursor: pointer;
`

const Toggler = styled(Icon)`
  transform: ${props => props.toggled ? 'rotate(-180deg)' : 'none'};
`

const FaqHeader = props => (
  <Wrapper onClick={props.handleToggle}>
    {props.children}
    <Toggler name='down-arrow' size='16px' cursor toggled={props.toggled} />
  </Wrapper>
)

FaqHeader.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired
}

export default FaqHeader
