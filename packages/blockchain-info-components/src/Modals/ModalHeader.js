import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from '../Icons'
import { Text } from '../Text'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: ${(props) => (props.center ? 'center' : 'space-between')};
  align-items: center;
  width: 100%;
  padding: ${(props) => (props.tray ? '60px 10%' : '20px 30px')};
  box-sizing: border-box;
  border-bottom: 1px solid ${(props) => props.theme.grey000};
  padding-left: ${(props) => props.paddingHorizontal} !important;
  padding-right: ${(props) => props.paddingHorizontal} !important;

  & > :first-child {
    margin-right: 10px;
  }

  @media (max-width: 425px) {
    padding: 16px 16px;
  }
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const HeaderIcon = styled(Icon)`
  margin-right: 10px;
`

const ModalHeader = (props) => {
  const { children, closeButton, icon, onClose, paddingHorizontal } = props

  return (
    <Wrapper paddingHorizontal={paddingHorizontal} closeButton={closeButton} {...props}>
      <Header>
        {icon && <HeaderIcon name={icon} size='28px' weight={400} color='grey700' />}
        <Text
          size='20px'
          weight={400}
          color='grey700'
          className='headerText'
          data-e2e='modalHeaderText'
          capitalize
        >
          {children}
        </Text>
      </Header>
      {closeButton && (
        <Icon
          name='close'
          size='24px'
          weight={400}
          color='grey700'
          data-e2e='modalCloseButton'
          cursor
          onClick={onClose}
        />
      )}
    </Wrapper>
  )
}

ModalHeader.propTypes = {
  closeButton: PropTypes.bool,
  icon: PropTypes.string,
  onClose: PropTypes.func
}

ModalHeader.defaultProps = {
  closeButton: true
}

export default ModalHeader
