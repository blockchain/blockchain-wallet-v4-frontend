import React, { forwardRef } from 'react'
import { transparentize } from 'polished'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const zInterval = 10
const START_INTERVAL = 1040

const ModalBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: ${(props) => (props.isLast ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  background-color: ${(props) =>
    props.isLast && props.theme.black && transparentize(0.3, props.theme.greyFade800)};
  z-index: ${START_INTERVAL};

  ${(props) =>
    props.doNotHide &&
    css`
      display: flex;
      z-index: ${(props) => (props.zIndex ? props.zIndex : START_INTERVAL)};
      background-color: ${(props) =>
        props.isLast && props.theme.black
          ? transparentize(0.3, props.theme.greyFade800)
          : 'transparent'};
    `};

  @media (min-width: 768px) {
    align-items: center;
  }

  @media (max-width: 767px) {
    min-height: 100vh;
    /* stylelint-disable-next-line */
    min-height: -webkit-fill-available;
    overflow: auto;
  }
`

const BaseModal = styled.div`
  display: ${(props) => (props.isLast ? 'block' : 'none')};
  position: relative;
  width: 100%;
  z-index: ${(props) => (props.type === 'tray' ? START_INTERVAL - 1 : START_INTERVAL)};
  background-color: ${(props) => props.theme.white};
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 24px;
  box-shadow: 0 4px 32px ${(props) => props.theme.greyFade400};

  ${(props) =>
    props.doNotHide &&
    css`
      display: block;
      z-index: ${(props) => (props.zIndex ? props.zIndex : START_INTERVAL)};
    `};

  @media (min-width: 768px) {
    width: ${(props) => props.width};
    margin-top: initial;
    box-shadow: 0 5px 15px ${(props) => props.theme.black && transparentize(0.5, props.theme.black)};
  }
`

const selectWidth = (size) => {
  switch (size) {
    case 'auto':
      return 'auto'
    case 'xsmall':
      return '320px'
    case 'small':
      return '400px'
    case 'medium':
      return '480px'
    case 'large':
      return '600px'
    case 'xlarge':
      return '800px'
    default:
      return '1000px'
  }
}

const Modal = forwardRef((props, ref) => {
  const { children, doNotHide, ...rest } = props
  const modalDataE2e = rest.dataE2e || 'modal'
  const { type } = rest
  const size = rest.size || 'medium'
  const position = rest.position || 1
  const total = rest.total || 1
  // Props above not defaulted on purpose, so we can see when we forgot to pass them.
  const width = selectWidth(size, position)
  const isLast = total === position

  const zIndex = START_INTERVAL + zInterval * position

  if (type === 'tray') {
    return (
      <BaseModal
        data-e2e={modalDataE2e}
        isLast
        position={position}
        width={width}
        zIndex={zIndex}
        doNotHide={doNotHide}
        {...rest}
      >
        {children}
      </BaseModal>
    )
  }
  return (
    <ModalBackground
      isLast={isLast}
      position={position}
      className={rest.class}
      zIndex={zIndex}
      doNotHide={doNotHide}
    >
      <BaseModal
        data-e2e={modalDataE2e}
        isLast={isLast}
        position={position}
        width={width}
        ref={ref}
        zIndex={zIndex}
        doNotHide={doNotHide}
        {...rest}
      >
        {children}
      </BaseModal>
    </ModalBackground>
  )
})

Modal.propTypes = {
  position: PropTypes.number,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge', '']),
  total: PropTypes.number
}

export default Modal
