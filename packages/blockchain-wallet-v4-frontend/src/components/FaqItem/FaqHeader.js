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
  cursor: pointer;
`

const Toggler = styled(Icon).attrs({
  name: 'down-arrow'
})`
  transform: ${props => props.rotated ? 'rotate(-180deg)' : 'none'};
  color: ${props => props.rotated ? props.theme['brand-primary'] : 'inherit'};
  cursor: pointer;
  font-size: 10px;
`

const FaqHeader = props => (
  <Wrapper onClick={props.handleToggle}>
    {props.children}
    <Toggler toggled={props.toggled} />
  </Wrapper>
)

FaqHeader.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired
}

export default FaqHeader
