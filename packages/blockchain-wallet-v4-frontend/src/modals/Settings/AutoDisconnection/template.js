import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'

const AbsoluteModalHeader = styled(ModalHeader)`
  position: absolute;
  border: none;
  > span {
    &:hover {
      cursor: pointer;
    }
  }
  z-index: 99;
`
const Body = styled(ModalBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  margin-top: 24px;
`
const Header = styled(Text)`
  font-size: 24px;
  font-weight: 600;
  margin-top: 12px;
  color: ${props => props.theme['grey800']};
`
const Copy = styled(Text)`
  margin-top: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: ${props => props.theme['grey800']};
`
const FooterButton = styled(Button)`
  height: 56px;
  font-weight: 600;
  margin-top: 24px;
`
const AutoDisconnection = props => {
  const { duration, position, total, ...rest } = props
  const { handleCancel } = rest

  return (
    <Modal size='small' position={position} total={total}>
      <AbsoluteModalHeader onClick={handleCancel} />
      <Body>
        <Icon name='alert-filled' color='orange600' size='40px' />
        <Header>
          <FormattedMessage
            id='modals.autodisconnection.title'
            defaultMessage='Are you still there?'
          />
        </Header>
        <Copy>
          <FormattedMessage
            id='modals.autodisconnection.foryoursafety1'
            defaultMessage="You've been inactive for {duration} minutes. For your safety, you'll be logged out of your Wallet shortly."
            values={{ duration: duration }}
          />
        </Copy>
        <FooterButton
          nature='primary'
          size='16px'
          fullwidth
          onClick={handleCancel}
        >
          <FormattedMessage
            defaultMessage='Keep Me Logged In'
            id='modals.autodisconnection.keeploggedin'
          />
        </FooterButton>
      </Body>
    </Modal>
  )
}

AutoDisconnection.propTypes = {
  payload: PropTypes.shape({
    duration: PropTypes.number.isRequired,
    handleCancel: PropTypes.func,
    handleClick: PropTypes.func
  })
}

export default reduxForm({ form: 'autoDisconnection' })(AutoDisconnection)
