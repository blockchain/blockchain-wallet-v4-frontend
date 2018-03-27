import React from 'react'
import styled from 'styled-components'
import onClickOutside from 'react-onclickoutside'
import { Modal } from 'blockchain-info-components'
import Transition from 'react-transition-group/Transition'

const duration = 500

const defaultStyle = {
  transition: `top ${duration}ms`,
  top: '100%'
}

const transitionStyles = {
  entering: { top: '100%' },
  entered: { top: '60px' }
}

const TrayModal = styled(Modal)`
  right: 0;
  font-weight: 300;
  overflow: hidden;
  position: absolute;
  width: calc(33%);
  height: calc(100vh - 60px);
  font-family: 'Montserrat', Helvetica, sans-serif;
  > div:first-child {
    padding: 20px;
    background-color: ${props => props.theme['white-blue']};
    div:nth-child(1) {
      font-size: 16px;
    }
    > span:last-child {
      top: 22px;
      right: 25px;
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
    overflow: auto;
    padding: 20px;
    height: calc(100% - 160px);
  }
  @media (max-width: 767px) {
    width: 100%;
    right: 0px;
  }
`

class TrayRight extends React.Component {
  handleClickOutside () {
    this.props.onClose()
  }

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

export default onClickOutside(TrayRight)
