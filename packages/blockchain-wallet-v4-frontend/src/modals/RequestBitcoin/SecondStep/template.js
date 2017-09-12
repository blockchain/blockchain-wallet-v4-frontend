import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import CopyToClipBoard from 'react-copy-to-clipboard'

import { Button, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import CoinDisplay from 'components/CoinDisplay'
import CurrencyDisplay from 'components/CurrencyDisplay'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  background-color: ${props => props.theme['gray-1']};
  margin: 5px 0;

  & > * { padding: 5px 0; }
`
const LinkContainer = styled.div`
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  word-wrap: break-word;
  border-top: 1px solid ${props => props.theme['gray-2']};
`

const SecondStep = (props) => {
  const { satoshis, message, link, active, handleClick, previous, position, total, closeAll } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='request' onClose={closeAll}>
        <FormattedMessage id='modals.requestbitcoin.secondstep.title' defaultMessage='Request' />
      </ModalHeader>
      <ModalBody>
        <Form>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.requestbitcoin.secondstep.explain' defaultMessage='Send the link below to your friend of contact and they will be able to send bitcoin directly to your wallet.' />
          </Text>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.requestbitcoin.secondstep.payment' defaultMessage='Payment request:' />
          </Text>
          <Container>
            <Text size='24px' weight={600} color='transferred'>
              <CoinDisplay>{satoshis}</CoinDisplay>
            </Text>
            <Text size='20px' weight={600} color='transferred'>
              <CurrencyDisplay>{satoshis}</CurrencyDisplay>
            </Text>
            <Text size='16px'>{message}</Text>
            <LinkContainer>
              <Text size='12px' weight={300}>{link}</Text>
            </LinkContainer>
          </Container>
          <CopyToClipBoard text={link} onCopy={handleClick}>
            <Button nature={active ? 'copy' : 'secondary'} fullwidth uppercase>
              { active
                ? <FormattedMessage id='modals.requestbitcoin.secondstep.copied' defaultMessage='Copied!' />
                : <FormattedMessage id='modals.requestbitcoin.secondstep.copy' defaultMessage='Copy link' />
              }
            </Button>
          </CopyToClipBoard>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Link onClick={previous} size='13px' weight={300}>
          <FormattedMessage id='scenes.requestbitcoin.secondstep.back' defaultMessage='Go back' />
        </Link>
      </ModalFooter>
    </Modal>
  )
}

SecondStep.propTypes = {
  active: PropTypes.bool.isRequired,
  satoshis: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  previous: PropTypes.func.isRequired
}

export default SecondStep
