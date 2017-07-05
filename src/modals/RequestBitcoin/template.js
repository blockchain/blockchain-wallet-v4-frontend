import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalHeader, ModalBody } from 'components/Shared/Modal'
import { Button } from 'components/Shared/Button'
import TextArea from 'components/Shared/TextArea'
import DropdownSearch from 'components/Shared/DropdownSearch'
import Text from 'components/Shared/Text'

const RequestBitcoin = (props) => {
  return (
    <Modal isOpen={props.isOpen} size='lg' keyboard>
      <ModalHeader>
        <Text size='1.4rem'>
          <i className='icon-send padding-right-10' />
          <FormattedMessage id='components.shared.requestbitcoin.request' defaultMessage='Request' />
        </Text>
      </ModalHeader>
      <ModalBody>
        <Text size='0.9rem' weight={500} transform='capitalize'>
          <FormattedMessage id='components.shared.requestbitcoin.share' defaultMessage='Copy & share address:' />
        </Text>
        <Text size='0.9rem' weight={500} transform='capitalize'>
          <FormattedMessage id='components.shared.requestbitcoin.amount' defaultMessage='Enter amount:' />
        </Text>
        <Text size='0.9rem' weight={500} transform='capitalize'>
          <FormattedMessage id='components.shared.requestbitcoin.to' defaultMessage='Receive to:' />
        </Text>
        <DropdownSearch items={props.addresses} callback={props.selectAddress} />
        <Text size='0.9rem' weight={500} transform='capitalize'>
          <FormattedMessage id='components.shared.requestbitcoin.description' defaultMessage='Description:' />
        </Text>
        <TextArea placeholder="What's this transaction for?" fullwidth />
        <Button type='secondary' fullwidth>
          <FormattedMessage id='components.shared.requestbitcoin.next' defaultMessage='Next' />
        </Button>
      </ModalBody>
    </Modal>
  )
}

RequestBitcoin.defaultProps = {
  isOpen: false
}

RequestBitcoin.propTypes = {
  isOpen: PropTypes.bool.isRequired
}

export default RequestBitcoin
