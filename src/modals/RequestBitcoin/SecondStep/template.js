import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import CopyToClipBoard from 'react-copy-to-clipboard'

import { Button, Form, Link, Modal, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/CoinDisplay'
import CurrencyDisplay from 'components/CurrencyDisplay'

const CopyButton = styled(Button)`
  color: #FFFFFF;
  background-color: #006600;
  border: 1px solid #006600;
  text-transform: uppercase;

  &:hover { background-color: #006600 };
`
const PaymentRequestContainer = styled.div`
  background-color: #EFEFEF;
  margin: 5px 0;
`
const PaymentRequestContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #CDCDCD;

  & > * { padding: 15px 0; }
`
const PaymentRequestFooter = styled.span`
  padding: 15px;
  box-sizing: border-box;
  text-align: center;
  word-wrap: break-word;
`
const Footer = styled.div`
  padding: 5px 0;
`

const SecondStep = (props) => {
  const { satoshis, message, link, active, handleClick, previous, ...rest } = props

  return (
    <Modal {...rest} icon='icon-receive' title='Request created' size='large'>
      <Form>
        <FormattedMessage id='modals.requestbitcoin.secondstep.explain' defaultMessage='Send the link below to your friend of contact and they will be able to send bitcoin directly to your wallet.' />
        <FormattedMessage id='modals.requestbitcoin.secondstep.payment' defaultMessage='Payment request:' />
        <PaymentRequestContainer>
          <PaymentRequestContent>
            <CoinDisplay biggest cyan>{satoshis}</CoinDisplay>
            <CurrencyDisplay big light cyan>{satoshis}</CurrencyDisplay>
            <Text size='24px'>{message}</Text>
          </PaymentRequestContent>
          <PaymentRequestFooter>
            <Text size='12px'>{link}</Text>
          </PaymentRequestFooter>
        </PaymentRequestContainer>
        <CopyToClipBoard text={link} onCopy={handleClick}>
          { active
            ? <CopyButton fullwidth>
              <FormattedMessage id='modals.requestbitcoin.secondstep.copied' defaultMessage='Copied!' />
            </CopyButton>
            : <Button type='secondary' fullwidth>
              <FormattedMessage id='modals.requestbitcoin.secondstep.copy' defaultMessage='Copy link' />
            </Button>
          }
        </CopyToClipBoard>
        <Footer>
          <Link onClick={previous}>
            <FormattedMessage id='scenes.requestbitcoin.secondstep.back' defaultMessage='Go back' />
          </Link>
        </Footer>
      </Form>
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
