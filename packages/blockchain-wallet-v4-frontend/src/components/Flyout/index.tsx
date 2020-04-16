import { FlyoutE2EType } from './types'
import { Modal, Text } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import styled from 'styled-components'
import Transition from 'react-transition-group/Transition'
// TODO: use only ReactCSSTransitionGroup

export const duration = 500
export const slide = 500
export const width = 480

const defaultStyle = {
  transition: `right ${duration}ms`,
  right: `-${width}px`
}

const transitionStyles = {
  entering: { right: `-${width}px` },
  entered: { right: '0px' }
}

const FlyoutModal = styled(Modal)`
  border-radius: 0px;
  overflow: auto;
  position: absolute;
  width: ${width}px;
  height: 100vh;
  color: ${props => props.theme.grey700};
  ${media.mobile`
    width: 100%;
    height: calc(100vh - 80px);
    padding-bottom: 20px;
  `};
`

const FlyoutChildren = styled.div<{ direction: 'left' | 'right' }>`
  height: 100%;

  .flyout-children-enter {
    top: 0;
    ${props =>
      props.direction === 'left' &&
      `
      left: 99%;
    `}
    ${props =>
      props.direction === 'right' &&
      `
      left: -99%;
    `}
    opacity: 0.01;
    position: absolute;
  }

  .flyout-children-enter.flyout-children-enter-active {
    opacity: 1;
    left: 0;
    transition: left ${slide}ms, opacity ${slide}ms;
  }

  .flyout-children-leave {
    position: absolute;
    opacity: 1;
    left: 0;
    top: 0;
  }

  .flyout-children-leave.flyout-children-leave-active {
    ${props =>
      props.direction === 'left' &&
      `
      left: -99%;
    `}
    ${props =>
      props.direction === 'right' &&
      `
      left: 99%;
    `}
    opacity: 0.01;
    transition: left ${slide}ms, opacity ${slide}ms;
  }
`

export const FlyoutWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 40px;
  ${media.tablet`
    padding: 20px;
  `}
`

export const FlyoutChild = styled.div`
  height: 100%;
  width: 100%;
`
export const Row = styled.div`
  padding: 16px 40px;
  box-sizing: border-box;
  border-top: 1px solid ${props => props.theme.grey000};
  &:last-child {
    border-bottom: 1px solid ${props => props.theme.grey000};
  }
`
export const Title = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.grey600};
`
export const Value = styled(Text)`
  margin-top: 4px;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.grey800};
`

type OwnProps = {
  'data-e2e': FlyoutE2EType
  direction: 'left' | 'right'
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
            <FlyoutChildren direction={this.props.direction || 'left'}>
              <ReactCSSTransitionGroup
                transitionName='flyout-children'
                transitionEnterTimeout={slide}
                transitionLeaveTimeout={slide}
              >
                {/* Each child must be wrapped in FlyoutChild for transitioning to work */}
                {children}
              </ReactCSSTransitionGroup>
            </FlyoutChildren>
          </FlyoutModal>
        )}
      </Transition>
    )
  }
}

export default Flyout
