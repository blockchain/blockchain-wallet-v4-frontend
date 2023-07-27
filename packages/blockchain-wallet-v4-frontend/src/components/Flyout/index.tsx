import React, { ReactNode } from 'react'
import { ModalPropsType } from 'blockchain-wallet-v4-frontend/src/modals/types'
import { AnimatePresence, motion } from 'framer-motion'
import { equals } from 'ramda'
import styled from 'styled-components'

import { Modal, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

export const duration = 500
export const slide = 500
export const width = 480

const AnimatedModal = motion(Modal)

const FlyoutModal = styled(AnimatedModal)`
  border-radius: 0;
  overflow: auto;
  position: absolute;
  top: 0;
  right: 0;
  width: ${width}px;
  height: 100vh;
  color: ${(props) => props.theme.grey700};
  ${media.mobile`
    width: 100%;
    padding-bottom: 20px;
  `};
`

const FlyoutChildren = styled.div`
  height: 100%;
`

export const FlyoutWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 40px;
  ${media.tablet`
    padding: 20px;
  `}
`

export const FlyoutChild = styled((props) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} {...props} />
))`
  height: 100%;
  width: 100%;
`

export const Row = styled.div`
  padding: 16px 40px;
  box-sizing: border-box;
  border-top: 1px solid ${(props) => props.theme.grey000};
  &:last-child {
    border-bottom: 1px solid ${(props) => props.theme.grey000};
  }
`
export const Col = styled.div`
  display: flex;
  align-items: center;
`

export const Title = styled(Text)<{ asValue?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.grey900};
  margin-top: ${(props) => (props.asValue ? '4px' : '0px')};
`
export const Value = styled(Text)<{ asTitle?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.grey800};
  margin-top: ${(props) => (props.asTitle ? '0px' : '4px')};
`

// Hide the default field error for NumberBox > div > div:last-child
export const AmountFieldContainer = styled.div<{ isCrypto?: boolean }>`
  display: flex;
  align-items: center;
  margin-top: 54px;
  min-height: 76px;
  input {
    color: ${(props) => props.theme.black};
    padding-left: 8px;
    font-size: ${(props) => (props.isCrypto ? '36px' : '56px')};
    font-weight: 500;
    border: 0px !important;
    &::placeholder {
      font-size: ${(props) => (props.isCrypto ? '36px' : '56px')};
      color: ${(props) => props.theme.grey600};
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

class Flyout extends React.Component<Props> {
  shouldComponentUpdate = (nextProps) => !equals(this.props, nextProps)

  render() {
    const { children, doNotHide, isOpen, position, total, userClickedOutside } = this.props

    return (
      <AnimatePresence>
        {isOpen && !userClickedOutside ? (
          <FlyoutModal
            doNotHide={doNotHide}
            total={total}
            position={position}
            animate={{ x: 0 }}
            exit={{ x: width }}
            initial={{ x: width }}
            transition={{
              bounce: 0,
              duration: duration / 1000,
              type: 'spring'
            }}
          >
            <FlyoutChildren>
              {/* Each child must be wrapped in FlyoutChild for transitioning to work */}
              {children}
            </FlyoutChildren>
          </FlyoutModal>
        ) : null}
      </AnimatePresence>
    )
  }
}

type Props = Omit<ModalPropsType, 'close'> & {
  children: ReactNode
  doNotHide?: boolean
  isOpen: boolean
  onClose: () => void
}

export default Flyout
