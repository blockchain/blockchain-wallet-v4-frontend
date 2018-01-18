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
  font-family: 'Montserrat', Helvetica, sans-serif;
  cursor: pointer;
`

const Toggler = styled(Icon)`
  transform: ${props => props.rotated ? 'rotate(-180deg)' : 'none'};
  color: ${props => props.rotated ? props.theme['brand-primary'] : 'inherit'};
`

const FaqHeader = props => (
  <Wrapper onClick={props.handleToggle}>
    {props.children}
    <Toggler name='down-arrow' size='10px' cursor toggled={props.toggled} />
  </Wrapper>
)

FaqHeader.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired
}

export default FaqHeader
