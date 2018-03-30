import React from 'react'
import styled from 'styled-components'
import { Modal } from 'blockchain-info-components'
import PropTypes from 'prop-types'

const defaultStyle = {
  transition: `right 500ms`,
  right: 'calc(-33%)'
}

const transitionStyles = {
  closed: { right: 'calc(-33%)' },
  open: { right: '0' }
}

const AnimationWrapper = styled.div`
  position: absolute;
  width: calc(33%);
  height: calc(100vh - 60px);
  transition-property: right;
  transition-duration: 500ms;
  transition-timing-function: initial;
  transition-delay: initial;
  @media (max-width: 767px) {
    width: 100%;
    right: 0px;
  }
`
const TrayModal = styled(Modal)`
  font-weight: 300;
  overflow: hidden;
  width: 100%;
  height: 100%;
  z-index: 2;
  font-family: 'Montserrat', Helvetica, sans-serif;
  > div:first-child {
    padding: 20px;
    background-color: ${props => props.theme['white-blue']};
    div:nth-child(1) {
      font-size: 16px;
    }
    > span:last-child {
      top: 22px;
      right: 20px;
      font-size: 16px;
      position: absolute;
      font-weight: 500;
    }
    @media (max-width: 991px) {
      padding: 20px;
      justify-content: center;
    }
  }
  > div:last-child {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0px 20px 50px 20px;
    height: 100%;
  }
`

class TrayRight extends React.Component {
  render () {
    const { children, isOpen, ...rest } = this.props

    return (
      <AnimationWrapper style={{...defaultStyle, ...transitionStyles[isOpen ? 'open' : 'closed']}}>
        <TrayModal {...rest} type={'tray'}>
          {children}
        </TrayModal>
      </AnimationWrapper>
    )
  }
}

TrayRight.propTypes = {
  isOpen: PropTypes.bool.isRequired
}

export default TrayRight
