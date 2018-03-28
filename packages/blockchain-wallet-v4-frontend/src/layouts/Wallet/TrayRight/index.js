import React from 'react'
import styled from 'styled-components'
import { Modal } from 'blockchain-info-components'
import Transition from 'react-transition-group/Transition'
import PropTypes from 'prop-types'

const defaultStyle = {
  transition: `right 500ms`,
  right: 'calc(-33%)'
}

const transitionStyles = {
  entering: { right: 'calc(-33%)' },
  entered: { right: '0' }
}

const TrayModal = styled(Modal)`
  right: 0;
  font-weight: 300;
  overflow:hidden;
  position: absolute;
  width: calc(33%);
  height: calc(100vh - 60px);
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
  @media (max-width: 767px) {
    width: 100%;
    right: 0px;
  }
`

class TrayRight extends React.Component {
  render () {
    const { children, ...rest } = this.props
    return (
      <Transition in={this.props.in} timeout={0}>
        {(status) => (
          <TrayModal {...rest} type={'tray'} style={{...defaultStyle, ...transitionStyles[status]}}>
            {children}
          </TrayModal>
        )}
      </Transition>
    )
  }
}

TrayRight.propTypes = {
  in: PropTypes.bool.isRequired
}

export default TrayRight
