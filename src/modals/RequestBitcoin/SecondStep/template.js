import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import CopyToClipBoard from 'react-copy-to-clipboard'

import Modal from 'components/generic/Modal'
import { SecondaryButton } from 'components/generic/Button'
import { Link } from 'components/generic/Link'
import { Form } from 'components/generic/Form'
import { Text } from 'components/generic/Text'
import { Typography } from 'components/generic/Typography'
import CoinDisplay from 'components/shared/CoinDisplay'
import CurrencyDisplay from 'components/shared/CurrencyDisplay'

const CopyButton = styled(SecondaryButton)`
  background-color: #006600;
  border: 1px solid #006600;
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
  const { show, satoshis, message, link, active, handleClick, previous } = props

  return (
    <Modal icon='icon-receive' title='Request created' size='large' show={show}>
      <Form>
        <Text id='modals.requestbitcoin.secondstep.explain' text='Send the link below to your friend of contact and they will be able to send bitcoin directly to your wallet.' small light />
        <Text id='modals.requestbitcoin.secondstep.payment' text='Payment request:' small medium />
        <PaymentRequestContainer>
          <PaymentRequestContent>
            <CoinDisplay biggest cyan>{satoshis}</CoinDisplay>
            <CurrencyDisplay big light cyan>{satoshis}</CurrencyDisplay>
            <Typography big light>{message}</Typography>
          </PaymentRequestContent>
          <PaymentRequestFooter>
            <Typography small light>{link}</Typography>
          </PaymentRequestFooter>
        </PaymentRequestContainer>
        <CopyToClipBoard text={link} onCopy={handleClick}>
          { active
            ? <CopyButton fullwidth>
              <Text id='modals.requestbitcoin.secondstep.copied' text='Copied!' small medium white uppercase />
            </CopyButton>
            : <SecondaryButton fullwidth>
              <Text id='modals.requestbitcoin.secondstep.copy' text='Copy link' small medium uppercase white />
            </SecondaryButton>
          }
        </CopyToClipBoard>
        <Footer>
          <Link onClick={previous}><Text id='scenes.requestbitcoin.secondstep.back' text='Go back' small light cyan /></Link>
        </Footer>
      </Form>
    </Modal>
  )
}

SecondStep.defaultProps = {
  show: false
}

SecondStep.propTypes = {
  active: PropTypes.bool.isRequired,
  satoshis: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  previous: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}

export default SecondStep
