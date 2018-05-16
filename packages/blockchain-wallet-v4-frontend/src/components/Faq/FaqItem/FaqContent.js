import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: ${props => props.toggled ? 'flex' : 'none'};
  width: 100%;
  font-family: 'Montserrat', Helvetica, sans-serif;
  font-weight: 300;
  font-size: 13px;
  padding: 5px 0;
  color: ${props => props.theme['gray-5']};
`

const FaqContent = props => (
  <Wrapper toggled={props.toggled}>
    {props.children}
  </Wrapper>
)

FaqContent.propTypes = {
  toggled: PropTypes.bool.isRequired
}

export default FaqContent
