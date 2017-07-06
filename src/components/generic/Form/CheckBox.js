import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseCheckBox = (props) => {
  const { checked, ...rest } = props
  return (
    <input type='checkbox' checked={checked} {...rest} />
  )
}

const CheckBox = styled(BaseCheckBox)`
  width: 20px;
  height: 20px;
  position: relative; 
`
CheckBox.propTypes = {
  checked: PropTypes.bool
}

CheckBox.defaultProps = {
  checked: false
}

export default CheckBox
