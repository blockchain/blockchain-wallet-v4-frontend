import React, { ReactNode } from 'react'
import { ModalPropsType } from 'blockchain-wallet-v4-frontend/src/modals/types'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { Modal, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

// Brokerage specific flyout screens
import OrderSummary from './Brokerage/OrderSummary'
import FlyoutContainer from './Container'
import FlyoutContent from './Content'
import FlyoutFooter from './Footer'
import FlyoutHeader from './Header'
// Interest Upload Documents specific layout screens
import AdditionalInformation from './InterestUploadDocuments/AdditionalInformation'
import GetStarted from './InterestUploadDocuments/GetStarted'
import UploadAndVerify from './InterestUploadDocuments/UploadAndVerify'
import Uploaded from './InterestUploadDocuments/Uploaded'
// Recurring Buy specific flyout screens
import FrequencyScreen from './RecurringBuy/FrequencyScreen'
import RecurringBuyGettingStarted from './RecurringBuy/GettingStarted'
import RecurringBuyDetails from './RecurringBuy/RecurringBuyDetails'
import RecurringBuyRemoveConfirm from './RecurringBuy/RecurringBuyRemoveConfirm'
// These are the newest versions of flyout layouts and should eventually replace/integrate FlyoutWrapper etc.
import FlyoutSubHeader from './SubHeader'

export * from './model'
export {
  AdditionalInformation,
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader,
  FlyoutSubHeader,
  FrequencyScreen,
  GetStarted,
  OrderSummary,
  RecurringBuyDetails,
  RecurringBuyGettingStarted,
  RecurringBuyRemoveConfirm,
  UploadAndVerify,
  Uploaded
}

export const duration = 500
export const slide = 500
export const width = 480

const AnimatedModal = motion(Modal)

const FlyoutModal = styled(AnimatedModal)`
  border-radius: 0px;
  overflow: auto;
  position: absolute;
  top: 0;
  right: 0;
  width: ${width}px;
  height: 100vh;
  color: ${(props) => props.theme.grey700};
  ${media.mobile`
    width: 100%;
    height: calc(100vh - 80px);
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

export const StickyHeaderFlyoutWrapper = styled(FlyoutWrapper)`
  background-color: ${(props) => props.theme.white};
  position: sticky;
  top: 0;
  z-index: 99;
`

const Flyout = ({ children, isOpen, ...props }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && !props.userClickedOutside ? (
        <FlyoutModal
          transition={{
            bounce: 0,
            type: 'spring'
          }}
          initial={{ x: width }}
          animate={{ x: 0 }}
          exit={{ x: width }}
          {...props}
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

type Props = Omit<ModalPropsType, 'close'> & {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
}

export default Flyout
