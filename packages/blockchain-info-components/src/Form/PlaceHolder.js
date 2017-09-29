import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BasePlaceHolder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 300;
  color: ${props => props.theme['gray-3']};
  background-color: transparent;
`

const PlaceHolder = props => {
  const { handleClick, children, ...rest } = props

  return (
    <BasePlaceHolder {...rest} onClick={handleClick}>
      {children}
    </BasePlaceHolder>
  )
}

PlaceHolder.propTypes = {
  visible: PropTypes.bool,
  handleClick: PropTypes.func
}

PlaceHolder.defaultProps = {
  visible: true
}

export default PlaceHolder
