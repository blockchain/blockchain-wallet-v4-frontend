import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: ${props => (props.toggled ? 'flex' : 'none')};
  width: 100%;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 350;
  font-size: 14px;
  padding: 5px 0;
  color: ${props => props.theme.grey700};
`

const FaqContent = props => (
  <Wrapper toggled={props.toggled}>{props.children}</Wrapper>
)

FaqContent.propTypes = {
  toggled: PropTypes.bool.isRequired
}

export default FaqContent
