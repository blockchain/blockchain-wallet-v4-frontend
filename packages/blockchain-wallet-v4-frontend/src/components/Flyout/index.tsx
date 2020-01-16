import { E2EType } from './types'
import { Modal } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'
import Transition from 'react-transition-group/Transition'

export const duration = 500

const defaultStyle = {
  transition: `right ${duration}ms`,
  right: '0px'
}

const transitionStyles = {
  entering: { right: '-480px' },
  entered: { right: '0px' }
}

const FlyoutModal = styled(Modal)`
  right: 0px;
  font-weight: 400;
  overflow: hidden;
  position: absolute;
  width: 480px;
  height: 100vh;
  color: ${props => props.theme['gray-5']};
  ${media.mobile`
  width: 100%;
    height: calc(100vh - 60px):
    padding-top: 20px;
    padding-bottom: 20px;
  `};
`

type OwnProps = {
  in: boolean,
  position: number,
  total: number,
  onClose: () => void,
  'data-e2e': E2EType
}

class Flyout extends React.PureComponent<OwnProps> {
  handleClickOutside () {
    this.props.onClose()
  }

  render () {
    const { children, ...rest } = this.props

    return (
      <Transition in={this.props.in} timeout={0}>
        {status => (
          <FlyoutModal
            {...rest}
            type={'flyout'}
            style={{ ...defaultStyle, ...transitionStyles[status] }}
          >
            {children}
          </FlyoutModal>
        )}
      </Transition>
    )
  }
}

export default Flyout
