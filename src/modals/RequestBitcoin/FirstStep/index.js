import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import Modal from 'components/generic/Modal'
import { SecondaryButton } from 'components/generic/Button'
import { Icon } from 'components/generic/Icon'
import { Form, TextArea } from 'components/generic/Form'
import { Text } from 'components/generic/Text'
import DropdownSearch from 'components/shared/DropdownSearch'

const Separator = styled.div`
  flex-grow: 10;
  height: 1px;
  width: 100%;
  background-color: #EFEFEF;
`
const SeparatorContainer = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
  & :first-child { margin-right: 5px; }
  & :last-child { margin-left: 5px; }
`
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = props => (
  <div>
    <Icon name='icon-send' bigger />
    <Text id='modals.requestbitcoin.firststep.request' text='Request' bigger light />
  </div>
)

const FirstStep = props => {
  const { handleClickStep1, handleClickQRCode, selectAddress, addresses } = props

  return (
    <Modal title={Title} show={props.show}>
      <SeparatorContainer>
        <Separator />
        <Text id='modals.requestbitcoin.firststep.or' text='Or' small light uppercase />
        <Separator />
      </SeparatorContainer>
      <Form>
        <Row>
          <Text id='modals.requestbitcoin.firststep.share' text='Copy & share address:' small medium />
          <Text id='modals.requestbitcoin.firststep.view' text='View QR Code' small light cyan onClick={handleClickQRCode} />
        </Row>
        <Text id='modals.requestbitcoin.firststep.amount' text='Enter amount:' small medium />
        <Text id='modals.requestbitcoin.firststep.to' text='Receive to:' small medium />
        <DropdownSearch items={addresses} callback={selectAddress} />
        <Text id='modals.requestbitcoin.firststep.description' text='Description:' small medium />
        <Field name='info' component={TextArea} placeholder="What's this transaction for?" fullwidth />
        <SecondaryButton fullwidth onClick={handleClickStep1}>
          <Text id='modals.requestbitcoin.firststep.next' text='Next' small medium uppercase white />
        </SecondaryButton>
      </Form>
    </Modal>
  )
}

FirstStep.defaultProps = {
  show: false,
  animation: true
}

FirstStep.propTypes = {
  show: PropTypes.bool.isRequired,
  animation: PropTypes.bool
}

export default reduxForm({ form: 'requestBitcoinForm' })(FirstStep)
