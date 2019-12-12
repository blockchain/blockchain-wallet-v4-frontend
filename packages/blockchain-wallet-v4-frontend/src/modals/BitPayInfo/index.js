import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import {
  Link,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'
import styled from 'styled-components'

const Group = styled.div`
  margin-bottom: 16px;
`

function BitPayInfo ({ coin, modalActions, previousModal, close }) {
  return (
    <Modal>
      <ModalHeader>
        <Link size='20px' color='brand-primary' onClick={close}>
          Back
        </Link>
      </ModalHeader>
      <ModalBody>
        <Group>
          <Text weight={600} size='18px'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
        </Group>
        <Group>
          <Text weight={600}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          <Text weight={500} size='14px'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
        </Group>
        <Group>
          <Text weight={600}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          <Text weight={500} size='14px'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
        </Group>
        <Group>
          <Text weight={600}>Where can I get more information?</Text>
          <Text weight={500} size='14px'>
            You can find more information{' '}
            <Link
              size='14px'
              weight={500}
              href='https://support.blockchain.com/hc/en-us/sections/360006488871-Paying-BitPay-Invoices'
              target='_blank'
              rel='noopener noreferrer'
            >
              here.
            </Link>
          </Text>
        </Group>
      </ModalBody>
    </Modal>
  )
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('BitPayInfo'),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(BitPayInfo)
