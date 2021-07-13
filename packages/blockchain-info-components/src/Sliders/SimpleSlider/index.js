import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseSlider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 18px;
    width: 18px;
    border-radius: 9px;
    background: ${props => props.theme.blue600};
    cursor: pointer;
    margin-top: -8px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
  }

  &::-moz-range-thumb {
    height: 18px;
    width: 18px;
    border-radius: 9px;
    background: ${props => props.theme.blue600};
    cursor: pointer;
  }

  &::-ms-thumb {
    height: 18px;
    width: 18px;
    border-radius: 9px;
    background: ${props => props.theme.blue600};
    cursor: pointer;
  }

  &:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    background: #ffffff;
    border-radius: 1.3px;
    border: 0.1px solid ${props => props.theme.grey200};
  }

  &::-ms-track {
    width: 100%;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
`

const SimpleSlider = props => {
  return <BaseSlider {...props} />
}

SimpleSlider.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onInput: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired
}

export default SimpleSlider
