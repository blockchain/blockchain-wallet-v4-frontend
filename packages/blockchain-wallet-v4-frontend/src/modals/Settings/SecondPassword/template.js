import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PasswordInput,
  Text
} from 'blockchain-info-components'
import { Form, FormLabel } from 'components/Form'

const SecPasswordHeader = styled(ModalHeader)`
  border-bottom: 0;
  padding-bottom: 12px;
`

const PurposeContainer = styled.div`
  padding: 6px 30px 0px 30px;
`

const PURPOSES = {
  BLOCKSTACK: (
    <Text size='14px' weight={600} color='grey600'>
      <FormattedMessage
        id='modals.secondpassword.blockstack'
        defaultMessage='Our next airdrop is here. Enter your second password to reserve an address for the Blockstack Airdrop.'
      />
    </Text>
  )
}

const SecondPassword = props => {
  const { close, position, total, ...rest } = props
  const { handleSubmit, handleChange, purposes = [], value } = rest

  return (
    <Modal size='medium' position={position} total={total} closeButton={false}>
      <Form onSubmit={handleSubmit}>
        <SecPasswordHeader icon='safe' onClose={close}>
          <Text weight={600} size='20px'>
            <FormattedMessage
              id='modals.secondpassword.title1'
              defaultMessage='Enter Your Second Password'
            />
          </Text>
        </SecPasswordHeader>
        {purposes && purposes.length ? (
          <PurposeContainer>
            {purposes.map(purpose => PURPOSES[purpose])}
          </PurposeContainer>
        ) : null}
        <ModalBody>
          <FormLabel>
            <FormattedMessage
              id='modals.secondpassword.explain1'
              defaultMessage='Second Password'
            />
          </FormLabel>
          <PasswordInput
            value={value}
            onChange={handleChange}
            data-e2e='secondPasswordModalInput'
          />
        </ModalBody>
        <ModalFooter align='spaced'>
          <Link
            size='13px'
            weight={400}
            onClick={close}
            data-e2e='secondPasswordModalCancelButton'
          >
            <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
          </Link>
          <Button
            type='submit'
            nature='primary'
            onClick={handleSubmit}
            data-e2e='secondPasswordModalConfirmButton'
          >
            <FormattedMessage
              id='modals.secondpassword.confirm'
              defaultMessage='Confirm'
            />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

SecondPassword.propTypes = {
  secondPassword: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'secondPassword' })(SecondPassword)
