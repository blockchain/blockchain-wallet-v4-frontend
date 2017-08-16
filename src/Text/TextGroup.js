import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const BaseTextGroup = styled.div`
  text-align: justify;
  ${props => props.aligned
    ? '& > * { display: inline-block; margin-right: 10px; }'
    : '& > * { display: block; margin-bottom: 10px; }'}
`

const TextGroup = props => <BaseTextGroup {...props}/>

TextGroup.propTypes = {
  aligned: PropTypes.bool
}

TextGroup.defaultProps = {
  aligned: false
}

export default TextGroup
