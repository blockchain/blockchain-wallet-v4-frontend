import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
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
import Form from 'components/Form/Form'
import FormLabel from 'components/Form/FormLabel'
import { Padding } from 'components/Padding'

const SecPasswordHeader = styled(ModalHeader)`
  border-bottom: 0;
  padding-bottom: 12px;
`

const PurposeContainer = styled.div`
  padding: 6px 30px 0px 30px;
`

const RemovePassword = styled(Text)`
  cursor: pointer;
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

const SecondPassword = (props) => {
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
          <PurposeContainer>{purposes.map((purpose) => PURPOSES[purpose])}</PurposeContainer>
        ) : null}
        <ModalBody>
          <Padding bottom='1em'>
            <Text color='grey600' weight={500} size='16px'>
              <FormattedMessage
                id='modals.secondpassword.requesting_second_password'
                defaultMessage='We are requesting second password for your security. You can change this in settings.'
              />
            </Text>
          </Padding>
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
            placeholder='Enter second password'
          />
          <Padding top='.5em'>
            <LinkContainer to='/security-center/advanced'>
              <RemovePassword size='12px' weight={500} color='blue600' lineHeight='16px'>
                <FormattedMessage
                  id='modals.secondpassword.remove_pasword'
                  defaultMessage='Remove second password?'
                />
              </RemovePassword>
            </LinkContainer>
          </Padding>
        </ModalBody>
        <ModalFooter align='spaced'>
          <Button nature='empty-blue' onClick={close} data-e2e='secondPasswordModalCancelButton'>
            <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
          </Button>
          <Button
            type='submit'
            nature='primary'
            onClick={handleSubmit}
            data-e2e='secondPasswordModalConfirmButton'
          >
            <FormattedMessage id='modals.secondpassword.confirm' defaultMessage='Confirm' />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

SecondPassword.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  secondPassword: PropTypes.string
}

export default reduxForm({ form: 'secondPassword' })(SecondPassword)
