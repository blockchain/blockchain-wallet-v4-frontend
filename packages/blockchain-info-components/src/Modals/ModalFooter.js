import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  border-top: 1px solid ${props => props.theme.grey000};
`
const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.alignment};
  align-items: center;
  width: 100%;
`

const selectAlignment = align => {
  switch (align) {
    case 'left':
      return 'flex-start'
    case 'right':
      return 'flex-end'
    case 'center':
      return 'center'
    case 'spaced':
      return 'space-between'
    default:
      return ''
  }
}

const ModalFooter = props => {
  const { align, children, ...rest } = props
  const alignment = selectAlignment(align)
  return (
    <Wrapper {...rest}>
      <Footer alignment={alignment}>{children}</Footer>
    </Wrapper>
  )
}

ModalFooter.propTypes = {
  align: PropTypes.oneOf(['left', 'right', 'center', 'spaced'])
}

ModalFooter.defaultProps = {
  align: 'left'
}

export default ModalFooter
