import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ModalBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.isLast ? props.theme['halftransparentgrey'] : 'transparent'};
  z-index: ${props => props.position + 1040};
`

const BaseModal = styled.div`
  position: relative;
  width: calc(100% - ${props => props.position * 20}px);
  z-index: ${props => props.position + 1041};
  background-color: ${props => props.isLast ? props.theme['white'] : props.theme['gray-1']};

  @media(min-width: 768px) { width: ${props => props.width}; }
`

const selectWidth = (size, position) => {
  switch (size) {
    case 'small': return `${400 - ((position - 1) * 20)}px`
    case 'medium': return `${500 - ((position - 1) * 20)}px`
    case 'large': return `${600 - ((position - 1) * 20)}px`
    case 'xlarge': return `${1000 - ((position - 1) * 20)}px`
    default: return `${1000 - ((position - 1) * 20)}px`
  }
}

const Modal = props => {
  const { size, position, total, children, ...rest } = props
  const width = selectWidth(size, position)
  const isLast = total === position

  return (
    <ModalBackground isLast={isLast} position={position} {...rest}>
      <BaseModal isLast={isLast} position={position} width={width} {...rest}>
        {children}
      </BaseModal>
    </ModalBackground>
  )
}

Modal.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', '']),
  closeButton: PropTypes.bool
}

Modal.defaultProps = {
  size: 'medium',
  closeButton: true
}

export default Modal
