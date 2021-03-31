import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Transition from 'react-transition-group/Transition'
import { ModalPropsType } from 'blockchain-wallet-v4-frontend/src/modals/types'
import styled from 'styled-components'

import { Modal, Text } from 'blockchain-info-components'
import { media } from 'services/styles'
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
export const Col = styled.div`
  display: flex;
  align-items: center;
`

export const Title = styled(Text)<{ asValue?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.grey900};
  margin-top: ${props => (props.asValue ? '4px' : '0px')};
`
export const Value = styled(Text)<{ asTitle?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.grey800};
  margin-top: ${props => (props.asTitle ? '0px' : '4px')};
`

// Hide the default field error for NumberBox > div > div:last-child
export const AmountFieldContainer = styled.div<{ isCrypto?: boolean }>`
  display: flex;
  align-items: center;
  margin-top: 54px;
  min-height: 76px;
  input {
    color: ${props => props.theme.black};
    padding-left: 8px;
    font-size: ${props => (props.isCrypto ? '36px' : '56px')};
    font-weight: 500;
    border: 0px !important;
    &::placeholder {
      font-size: ${props => (props.isCrypto ? '36px' : '56px')};
      color: ${props => props.theme.grey600};
    }
  }
  > div {
    height: auto;
    white-space: nowrap;
    input {
      height: auto;
      outline: 0;
    }
  }
  > div > div:last-child {
    display: none;
  }
`

export const StickyHeaderFlyoutWrapper = styled(FlyoutWrapper)`
  background-color: ${props => props.theme.white};
  position: sticky;
  top: 0;
  z-index: 99;
`

class Flyout extends React.PureComponent<
  Omit<ModalPropsType, 'close'> & {
    direction: 'right' | 'left'
    in: boolean
    onClose: () => void
  }
> {
  render() {
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
