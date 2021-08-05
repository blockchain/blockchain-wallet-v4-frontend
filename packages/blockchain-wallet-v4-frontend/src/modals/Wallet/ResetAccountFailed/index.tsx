import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Link, Modal, Text } from 'blockchain-info-components'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  margin: 30px 0 10px;
  overflow: hidden;
  text-align: center;
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  text-align: center;
  margin: 4px 0 14px;

  & > :last-child {
    margin: 15px 0;
  }
`

const RectangleBackground = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
  width: 100%;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 8px;
  margin-top: 24px;
`

class ResetAccountFailed extends React.PureComponent<Props> {
  render() {
    return (
      <Modal size='medium'>
        <Header>
          <Icon
            name='alert-filled'
            size='48px'
            color='orange600'
            style={{ marginBottom: '16px' }}
          />
          <Text size='20px' weight={600} color='grey900'>
            <FormattedMessage
              defaultMessage='Fund Recovery Failed'
              id='modals.resetaccountfailure.title'
            />
          </Text>
        </Header>
        <Body>
          <Text size='14px' weight={500} color='grey900'>
            <FormattedMessage
              defaultMessage='Don’t worry, your account is safe.  Please contact support to finish the Account Recovery process. Your account will not show balances or transaction history until you complete the recovery process.'
              id='modals.resetaccountfailure.body'
            />
          </Text>
          <RectangleBackground>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage
                defaultMessage='Fund recovery failures can happen for a number of reasons. Our support team is able to help recover your account. <a>Learn more</a>'
                id='modals.resetaccountfailure.information'
                values={{
                  a: (msg) => (
                    <a
                      href='https://support.blockchain.com/hc/en-us/articles/4404679303700'
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      {msg}
                    </a>
                  )
                }}
              />
            </Text>
          </RectangleBackground>
          <Link
            target='_blank'
            href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360003112491'
          >
            <Button nature='primary' width='440px' data-e2e='contactSupportResetFailure'>
              <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
            </Button>
          </Link>
        </Body>
      </Modal>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(actions.modals.closeModal())
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

const enhance = compose<any>(
  connect(null, mapDispatchToProps),
  modalEnhancer('RESET_ACCOUNT_FAILED'),
  connector
)

export default enhance(ResetAccountFailed)
