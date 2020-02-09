import { E2EType } from './types'
import { Modal } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'
import Transition from 'react-transition-group/Transition'

export const duration = 500

const defaultStyle = {
  transition: `right ${duration}ms`,
  right: '-480px'
}

const transitionStyles = {
  entering: { right: '-480px' },
  entered: { right: '0px' }
}

const FlyoutModal = styled(Modal)`
  border-radius: 0px;
  overflow: auto;
  position: absolute;
  width: 480px;
  height: 100vh;
  color: ${props => props.theme['gray-5']};
  ${media.mobile`
    width: 100%;
    height: calc(100vh - 80px);
    padding-bottom: 20px;
  `};
`

export const FlyoutWrapper = styled.div`
  padding: 40px;
  ${media.tablet`
    padding: 20px;
  `}
`

type OwnProps = {
  'data-e2e': E2EType
  in: boolean
  onClose: () => void
  position: number
  total: number
  userClickedOutside: boolean
}

class Flyout extends React.PureComponent<OwnProps> {
  render () {
    const { children, ...rest } = this.props

    return (
      <Transition
        in={this.props.in && !this.props.userClickedOutside}
        timeout={0}
      >
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
