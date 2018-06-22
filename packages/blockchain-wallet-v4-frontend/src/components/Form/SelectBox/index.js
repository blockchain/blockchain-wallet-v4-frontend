import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { SelectInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  background-color: ${props => props.theme['white']};
`
const Error = styled.label`
  position: absolute;
  top: ${props => props.errorBottom ? '40px' : '-20px'};
  right: 0;
  display: block;
  height: 15px;
  font-size: 12px;
  font-weight: 300;
  font-family: 'Montserrat', Helvetica, sans-serif;
  color: ${props => props.theme['error']};
`

const SelectBox = (props) => {
  const { input, meta, hideErrors, ...rest } = props
  const { touched, invalid, error, pristine } = meta
  const errorState = touched && invalid ? 'invalid' : 'initial'

  return (
    <Container>
      <SelectInput {...input} {...meta} {...rest} errorState={errorState} />
      {(touched || !pristine) && error && !hideErrors && <Error>{error}</Error>}
    </Container>
  )
}

SelectBox.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
  }).isRequired,
  elements: PropTypes.arrayOf(PropTypes.shape({
    group: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired, PropTypes.object.isRequired]),
      value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired, PropTypes.object.isRequired])
    })).isRequired
  })).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchEnabled: PropTypes.bool,
  opened: PropTypes.bool
}

export default SelectBox
