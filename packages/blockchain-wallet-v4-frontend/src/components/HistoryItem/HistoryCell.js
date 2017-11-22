import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  flex-basis: ${props => props.width};
  padding: 8px 30px;
  box-sizing: border-box;
`

const HistoryCell = ({ children, ...rest }) => (
  <Wrapper {...rest}>
    {children}
  </Wrapper>
)

HistoryCell.propTypes = {
  width: PropTypes.string
}

HistoryCell.defaultProps = {
  width: '100%'
}

export default HistoryCell
