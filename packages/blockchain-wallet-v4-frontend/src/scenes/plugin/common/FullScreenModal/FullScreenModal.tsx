import React from 'react'
import { animated, useTransition } from 'react-spring'
import styled from 'styled-components'

import ModalPortal from './ModalPortal'

const ModalWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  box-sizing: border-box;
  z-index: 1;
`

const ModalContent = styled.div`
  background: ${(props) => props.theme.exchangeLogin};
  position: absolute;
  margin: auto;
  width: 100%;
  max-width: 800px;
  height: 100%;
  z-index: 1;
  overflow: auto;
`

const InnerContent = styled.div`
  padding: 20px;
  height: 100%;
  position: relative;
  -webkit-overflow-scrolling: touch;
`

export interface IFullScreenModalProps {
  isOpen: boolean
  onClose?(): void
}

const FullScreenModal: React.FC<IFullScreenModalProps> = ({ children, isOpen }) => {
  const modalTransition = useTransition(isOpen, {
    enter: { opacity: 1 },
    from: { opacity: 0 },
    leave: { opacity: 0 }
  })

  return (
    <ModalPortal>
      {modalTransition(
        (styles, item) =>
          item && (
            <ModalWrapper as={animated.div} style={styles} aria-modal='true' role='dialog'>
              <ModalContent as={animated.div}>
                <InnerContent>{children}</InnerContent>
              </ModalContent>
            </ModalWrapper>
          )
      )}
    </ModalPortal>
  )
}
export default FullScreenModal
