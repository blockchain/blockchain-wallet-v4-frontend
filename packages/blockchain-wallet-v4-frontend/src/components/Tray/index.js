import React from 'react'
import styled from 'styled-components'
import { Modal } from 'blockchain-info-components'
import Transition from 'react-transition-group/Transition'
import Media from 'services/ResponsiveService'

// TODO: refactor to not use react-transition-group. then remove that dependency all together
export const duration = 500

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
      right: 30px;
      position: absolute;
    }
    ${Media.laptop`
      padding: 50px;
      justify-content: center;
    `};
    ${Media.mobile`
      padding-top: 20px;
      padding-bottom: 20px;
      > span:last-child {
        top: 20px;
        right: 25px;
      }
    `};
  }
  > div:last-child {
    overflow: auto;
    padding: 60px 15%;
    height: calc(100% - 160px);
    ${Media.mobile`
      padding: 20px 10%;
    `};
  }
  ${Media.tablet`
    width: 100%;
    left: 0px;
  `};
  ${Media.mobile`
    height: calc(100vh - 60px):
    padding-top: 20px;
    padding-bottom: 20px;
  `};
`

class Tray extends React.PureComponent {
  handleClickOutside () {
    this.props.onClose()
  }

  render () {
    const { children, ...rest } = this.props
    return (
      <Transition in={this.props.in} timeout={0}>
        {status => (
          <TrayModal
            {...rest}
            type={'tray'}
            style={{ ...defaultStyle, ...transitionStyles[status] }}
          >
            {children}
          </TrayModal>
        )}
      </Transition>
    )
  }
}

export default Tray
