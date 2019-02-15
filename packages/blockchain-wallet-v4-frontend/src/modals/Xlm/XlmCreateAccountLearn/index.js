import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import modalEnhancer from 'providers/ModalEnhancer'
import { model } from 'data'

import {
  Modal,
  ModalHeader,
  ModalBody,
  Text,
  Icon,
  Link
} from 'blockchain-info-components'

const Header = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const Title = styled(Text)`
  font-size: 22px;
  font-weight: 300;
  margin-bottom: 16px;
`
const Paragraph = styled(Text)`
  font-size: 14px;
  font-weight: 200;
`
const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 200;
`
const BackIcon = styled(Icon)`
  font-size: 20px;
  font-weight: 800;
  margin-right: 16px;
`

class XlmCreateAccountLearn extends React.PureComponent {
  render () {
    const { position, total, close } = this.props
    return (
      <Modal size='medium' position={position} total={total} closeAll={close}>
        <ModalHeader onClose={close}>
          <Header onClick={close}>
            <BackIcon name='left-arrow' />
            <FormattedMessage
              id='modal.createaccountlearn.back'
              defaultMessage='Back'
            />
          </Header>
        </ModalHeader>
        <ModalBody>
          <Title>
            <FormattedMessage
              id='modal.createaccountlearn.title'
              defaultMessage='Stellar mimimum balance requirement.'
            />
          </Title>
          <Paragraph>
            <FormattedMessage
              id='modal.createaccountlearn.info1'
              defaultMessage='Stellar requires that all Stellar accounts hold a minimum balance of lumens, or XLM. This means you cannot send a balance out of your Stellar Wallet that would leave your Stellar Wallet with less than the minimum balance. This also means that in order to send XLM to a new Stellar account, you must send enough XLM to meet the minimum balance requirement.'
            />
          </Paragraph>
          <br />
          <Paragraph>
            <FormattedMessage
              id='modal.createaccountlearn.info2'
              defaultMessage='The current minimum balance requirement is 1 XLM.'
            />
          </Paragraph>
          <br />
          <Paragraph>
            <FormattedMessage
              id='modal.createaccountlearn.info3'
              defaultMessage='You can read more information about Stellar’s minimum balance requirement at'
            />{' '}
            <StyledLink
              href='https://www.stellar.org/developers/guides/concepts/fees.html#minimum-account-balance'
              target='_blank'
            >
              <FormattedMessage
                id='modal.createaccountlearn.link'
                defaultMessage='Stellar.org'
              />
            </StyledLink>
          </Paragraph>
        </ModalBody>
      </Modal>
    )
  }
}

XlmCreateAccountLearn.propTypes = {
  reserveXlm: PropTypes.string.isRequired
}

export default modalEnhancer(
  model.components.sendXlm.CREATE_ACCOUNT_LEARN_MODAL
)(XlmCreateAccountLearn)
