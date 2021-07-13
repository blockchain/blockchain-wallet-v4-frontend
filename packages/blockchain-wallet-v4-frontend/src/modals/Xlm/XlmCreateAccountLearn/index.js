import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import {
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { actions, model } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

const Header = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const Title = styled(Text)`
  font-size: 22px;
  font-weight: 400;
  margin-bottom: 16px;
`
const Paragraph = styled(Text)`
  font-size: 14px;
  font-weight: 400;
`
const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 400;
`
const BackIcon = styled(Icon)`
  font-size: 20px;
  font-weight: 800;
  margin-right: 16px;
`

class XlmCreateAccountLearn extends React.PureComponent {
  onClose = () => {
    this.props.closeAll()
    this.props.modalActions.showModal('SEND_XLM_MODAL', {
      origin: '@SEND.XLM.CREATE_ACCOUNT_LEARN_MODAL'
    })
  }

  render() {
    const { position, total } = this.props
    return (
      <Modal
        size='medium'
        position={position}
        total={total}
        closeAll={this.onClose}
        data-e2e='xlmMinimumModalShort'
      >
        <ModalHeader onClose={this.onClose}>
          <Header onClick={this.onClose}>
            <BackIcon
              name='arrow-left'
              data-e2e='xlmMinimumModalBack'
              size='20px'
            />
            <FormattedMessage id='buttons.back' defaultMessage='Back' />
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

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer(model.components.sendXlm.CREATE_ACCOUNT_LEARN_MODAL),
  connect(null, mapDispatchToProps)
)

export default enhance(XlmCreateAccountLearn)
