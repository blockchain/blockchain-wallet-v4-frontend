import React from 'react'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'

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
  color: ${(props) => props.theme.grey800};
  text-align: center;
`
const Copy = styled(Text)`
  margin-top: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: ${(props) => props.theme.grey800};
`
const FooterButton = styled(Button)`
  height: 56px;
  font-weight: 600;
  margin-top: 24px;
`
const NewVersionAvailable = (props) => {
  return (
    <Modal size='small' style={{ zIndex: 999 }}>
      <Body>
        <Header>
          <FormattedMessage
            id='modals.new_version_available.title'
            defaultMessage='New Version Available'
          />
        </Header>
        <Copy>
          <FormattedMessage
            id='modals.new_version_available.prevent_errors_login'
            defaultMessage='In order to use the newest version we ask that you please refresh the page and log in again.'
          />
        </Copy>
        <FooterButton
          data-e2e='refresh-wallet'
          nature='primary'
          size='16px'
          fullwidth
          // @ts-ignore
          onClick={() => window.location.reload(true)}
        >
          <FormattedMessage
            defaultMessage='Get New Version'
            id='modals.new_version_available.keeploggedin'
          />
        </FooterButton>
      </Body>
    </Modal>
  )
}

export default reduxForm({ form: 'newVersion' })(NewVersionAvailable)
