import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const StyledText = styled.div`
  font-family: ${props => props.font || 'Montserrat'};
`

const Text = ({ weight, size, ...props, children }) => {
  return(
    <StyledText className={`em-${ weight } f-${ size }`} {...props}>
      { children }
    </StyledText>
  )
}

Text.propTypes = {
  size: PropTypes.number.isRequired,
  font: PropTypes.string,
  weight: PropTypes.number.isRequired
}

export default Text
