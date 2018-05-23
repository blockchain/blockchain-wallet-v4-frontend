import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import CopyToClipBoard from 'react-copy-to-clipboard'

import { Button, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  margin-top: 5px;
  margin-bottom: 15px;
  background-color: ${props => props.theme['white-blue']};

  & > * { padding: 5px 0; }
`
const LinkContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 20px 15px 0px 15px;
  text-align: center;
  word-wrap: break-word;
  border-top: 1px solid ${props => props.theme['gray-1']};
`
const SubHeader = styled(Text)`
  margin-bottom: 20px;
`

const SecondStep = (props) => {
  const { previousStep, position, total, modalActions, ...rest } = props
  const { handleSubmit, satoshis, message, link, active } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='request' onClose={modalActions.closeAllModals}>
        <FormattedMessage id='modals.requestbitcoin.secondstep.title' defaultMessage='Request' />
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <SubHeader size='14px' weight={300}>
            <FormattedMessage id='modals.requestbitcoin.secondstep.explain' defaultMessage='Send the link below to your friend of contact and they will be able to send bitcoin directly to your wallet.' />
          </SubHeader>
          <Text size='14px' weight={500}>
            <FormattedMessage id='modals.requestbitcoin.secondstep.payment' defaultMessage='Payment Request:' />
          </Text>
          <Container>
            <CoinDisplay size='28px' weight={500} color='received' coin='BTC'>{satoshis}</CoinDisplay>
            <FiatDisplay size='20px' weight={300} color='received' coin='BTC'>{satoshis}</FiatDisplay>
            <Text size='16px'>
              <FormattedMessage id='modals.requestbitcoin.secondstep.message' defaultMessage='For "{message}"' values={{message: message}} />
            </Text>
            <LinkContainer>
              <Text size='12px' weight={300}>{link}</Text>
            </LinkContainer>
          </Container>
          <CopyToClipBoard text={link}>
            <Button type='submit' nature={active ? 'copy' : 'primary'} fullwidth uppercase>
              { active
                ? <FormattedMessage id='modals.requestbitcoin.secondstep.copied' defaultMessage='Copied!' />
                : <FormattedMessage id='modals.requestbitcoin.secondstep.copy' defaultMessage='Copy link' />
              }
            </Button>
          </CopyToClipBoard>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Link onClick={previousStep} size='13px' weight={300}>
          <FormattedMessage id='scenes.requestbitcoin.secondstep.back' defaultMessage='Go Back' />
        </Link>
      </ModalFooter>
    </Modal>
  )
}

SecondStep.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  satoshis: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  previousStep: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'requestBitcoin', destroyOnUnmount: false })(SecondStep)
