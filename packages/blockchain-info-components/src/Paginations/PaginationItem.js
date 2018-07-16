import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${props =>
    props.selected === 1 ? props.theme['white'] : props.theme['gray-6']};
  background-color: ${props =>
    props.selected === 1 ? props.theme['brand-primary'] : 'transparent'};
  border: 1px solid ${props => props.theme['gray-1']};
  border-radius: 5px;
  margin-right: 5px;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme['white']};
    background-color: ${props =>
      props.selected === 1
        ? props.theme['brand-primary']
        : props.theme['brand-secondary']};
  }
`

const PaginationItem = props => {
  const { children, selected, ...rest } = props
  return (
    <Wrapper selected={selected ? 1 : 0} {...rest}>
      {children}
    </Wrapper>
  )
}

PaginationItem.propTypes = {
  selected: PropTypes.bool
}

PaginationItem.defaultProps = {
  selected: false
}

export default PaginationItem
