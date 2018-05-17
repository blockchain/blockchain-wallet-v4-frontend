import React from 'react'
import styled from 'styled-components'
import onClickOutside from 'react-onclickoutside'
import { Modal } from 'blockchain-info-components'
import Transition from 'react-transition-group/Transition'

// TODO: refactor to not use react-transition-group. then remove that dependency all together
const duration = 500

const defaultStyle = {
  transition: `top ${duration}ms`,
  top: '100%'
}

const transitionStyles = {
  entering: { top: '100%' },
  entered: { top: '0px' }
}

const TrayModal = styled(Modal)`
  left: 0px;
  font-weight: 300;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100vh;
  color: ${props => props.theme['gray-5']};
  font-family: 'Montserrat', Helvetica, sans-serif;
  > div:first-child {
    padding: 60px 40px 60px 60px;
    > span:last-child {
      top: 30px;
      right: 40px;
      position: absolute;
    }
    @media (max-width: 991px) {
      padding: 50px;
      justify-content: center;
    }
  }
  > div:last-child {
    overflow: auto;
    padding: 60px 15%;
    height: calc(100% - 160px);
  }
  @media (max-width: 767px) {
    width: 100%;
    left: 0px;
  }
`

class Tray extends React.PureComponent {
  handleClickOutside () {
    this.props.onClose()
    // TODO: may need to check something about the modal stack here
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

export default Tray
