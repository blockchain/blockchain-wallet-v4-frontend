import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Media } from '../MediaSizes'
const Wrapper = styled.div`
  flex-basis: ${props => props.width};
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  ${Media.mobile`
    flex-basis: ${props => props.mobileWidth};
    display: ${props => (props.hideMobile ? `none` : `flex`)};
  `};
`

const TableCell = ({ children, ...rest }) => (
  <Wrapper {...rest}>{children}</Wrapper>
)

TableCell.propTypes = {
  width: PropTypes.string
}

TableCell.defaultProps = {
  width: '100%'
}

export default TableCell
