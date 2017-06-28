import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Item = styled.a`padding-left: 10px;`

const DropdownLanguageItem = ({ onClick, culture, children }) => (
  <Item className='dropdown-item' onClick={() => onClick(culture)}>{children}</Item>
)

DropdownLanguageItem.propTypes = {
  culture: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default DropdownLanguageItem
