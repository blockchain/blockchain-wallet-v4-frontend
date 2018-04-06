import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  flex-basis: ${props => props.width};
  display: flex;
  flex-direction: row;
  padding: 8px 30px;
  box-sizing: border-box;
`

const TableCell = ({ children, ...rest }) => (
  <Wrapper {...rest}>
    {children}
  </Wrapper>
)

TableCell.propTypes = {
  width: PropTypes.string
}

TableCell.defaultProps = {
  width: '100%'
}

export default TableCell
