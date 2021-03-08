import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${props =>
    props.selected === 1 ? props.theme.white : props.theme['grey800']};
  background-color: ${props =>
    props.selected === 1 ? props.theme.blue900 : 'transparent'};
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 5px;
  margin-right: 5px;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.white};
    background-color: ${props =>
      props.selected === 1 ? props.theme.blue900 : props.theme.blue600};
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
