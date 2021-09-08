import React from 'react'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Modal, ModalBody, Text } from 'blockchain-info-components'

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
  color: ${(props) => props.theme.grey800};
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
  const { position, total, ...rest } = props
  const { handleSubmit } = rest

  return (
    <Modal size='small' position={position} total={total}>
      <Body>
        <Icon name='bell' color='blue600' size='40px' />
        <Header>
          <FormattedMessage
            id='modals.new_version_available.title'
            defaultMessage='New Version Available'
          />
        </Header>
        <Copy>
          <FormattedMessage
            id='modals.new_version_available.prevent_errors'
            defaultMessage='In order to use the new version of the wallet we ask that you please refresh the page and log back in to your account.'
          />
        </Copy>
        <FooterButton
          data-e2e='refresh-wallet'
          nature='primary'
          size='16px'
          fullwidth
          onClick={handleSubmit}
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
