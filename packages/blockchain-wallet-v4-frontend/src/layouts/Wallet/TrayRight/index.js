import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'

import Faq from 'components/Faq'
import WhatsNew from 'components/WhatsNew'
import { Modal } from 'blockchain-info-components'

const AnimationWrapper = styled.div`
  width: calc(33%);
  right: calc(-50%);
  height: calc(100vh - 60px);
  position: absolute;
  transition: right 0.4s linear;

  &.open {
    right: 0;
  }

  @media (max-width: 991px) {
    width: calc(50%);
    right: calc(-75%);
  }

  @media (max-width: 767px) {
    width: calc(100%);
    right: calc(-110%);
  }
`
const TrayModal = styled(Modal)`
  font-weight: 300;
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin-top: 0px;
  z-index: 2;

  > div:first-child {
    padding: 20px;
    background-color: ${props => props.theme['white-blue']};
    div:nth-child(1) {
      font-size: 16px;
    }

    > span:last-child {
      top: 22px;
      right: 20px;
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
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0px 20px 50px 20px;
    height: 100%;
  }
`
class TrayRight extends React.Component {
  constructor (props) {
    super(props)

    this.handleTrayRightToggle = props.handleTrayRightToggle
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  handleClickOutside () {
    this.handleTrayRightToggle('', true)
  }

  render () {
    const { isOpen, handleTrayRightToggle, trayRightContent, ...rest } = this.props

    return (
      <AnimationWrapper className={isOpen ? 'open' : ''}>
        <TrayModal {...rest} type={'tray'} position={1} total={1}>
          {(() => {
            switch (trayRightContent) {
              case 'faq': return <Faq handleTrayRightToggle={handleTrayRightToggle} />
              case 'whats-new': return <WhatsNew handleTrayRightToggle={handleTrayRightToggle} />
              default: return null
            }
          })()}
        </TrayModal>
      </AnimationWrapper>
    )
  }
}

TrayRight.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleTrayRightToggle: PropTypes.func.isRequired,
  trayRightContent: PropTypes.string.isRequired
}

export default onClickOutside(TrayRight)
