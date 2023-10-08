import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Link, Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'
import { ModalName } from 'data/types'

import { Props as OwnProps } from '.'

const Body = styled(ModalBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
const Error = (props: Props) => {
  const { position, total } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <FormattedMessage id='modals.securitynotice.title' defaultMessage='Security Notice' />
      </ModalHeader>

      <Body>
        <Icon color='error' name='close-circle' size='40px' />

        <Text style={{ margin: '16px 0 16px' }}>
          <FormattedMessage
            id='sweep.failedtransaction'
            defaultMessage='There was an issue transferring your funds. Please contact Support.'
          />
        </Text>

        <Link target='_blank' href='https://support.blockchain.com/'>
          <Button
            nature='primary'
            fullwidth
            style={{ marginTop: '16px' }}
            height='50px'
            data-e2e=''
          >
            <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
          </Button>
        </Link>
      </Body>
    </Modal>
  )
}

type Props = {
  position: number
  total: number
} & OwnProps

export default Error
