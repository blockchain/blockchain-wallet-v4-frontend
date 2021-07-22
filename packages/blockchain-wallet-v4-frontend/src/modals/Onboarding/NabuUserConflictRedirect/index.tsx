import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'

import { Icon, Modal, Text } from 'blockchain-info-components'
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

class NabuUserConflictRedirect extends React.PureComponent<Props> {
  render() {
    const { errorMessage } = this.props
    return (
      <Modal size='small'>
        <Header>
          <Icon
            name='alert-filled'
            size='48px'
            color='orange600'
            style={{ marginBottom: '16px' }}
          />
          <Text size='20px' weight={500}>
            <FormattedMessage
              defaultMessage='Your Trading Account is linked to another wallet'
              id='modals.nabuuserconflict.title'
            />
          </Text>
        </Header>
        <Body>
          <Text size='14px' weight={500}>
            <FormattedMessage
              defaultMessage='Your Blockchain.com trading account is associated with another wallet. Please log into your wallet referenced below for account access.'
              id='modals.nabuuserconflict.body'
            />
          </Text>
          <Text size='14px' weight={400}>
            {errorMessage}
          </Text>
        </Body>
      </Modal>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(actions.modals.closeModal())
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  errorMessage: string
}

const enhance = compose<any>(
  connect(null, mapDispatchToProps),
  modalEnhancer('NABU_USER_CONFLICT_REDIRECT'),
  connector
)

export default enhance(NabuUserConflictRedirect)
