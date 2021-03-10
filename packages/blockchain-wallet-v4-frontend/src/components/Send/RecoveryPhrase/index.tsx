import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled, { css } from 'styled-components'

import { Icon } from 'blockchain-info-components'
import { BlueCartridge } from 'components/Cartridge'
import { actions } from 'data'

const customCartridge = css`
  display: flex;
  align-items: center;
  font-size: 14px;
`
const CustomBlueCartridge = styled(BlueCartridge)`
  ${customCartridge}
`
const BackupCopy = styled.div`
  display: inline;
`
const BackupLink = styled.span`
  color: ${props => props.theme.blue600};
  text-decoration: underline;
  cursor: pointer;
`

class MnemonicRequiredForCustodySend extends React.PureComponent<Props> {
  handleClick = () => {
    this.props.modalActions.showModal('RECOVERY_PHRASE_MODAL', {
      origin: 'Send'
    })
  }
  render() {
    return (
      <CustomBlueCartridge>
        <Icon
          name='alert-filled'
          color='blue600'
          size='24px'
          style={{ marginRight: '12px' }}
        />
        <BackupCopy>
          <FormattedMessage
            id='modals.send.firststep.fromcustody2'
            defaultMessage='Please backup your Wallet before before sending crypto to it.'
          />{' '}
          <BackupLink onClick={this.handleClick} data-e2e='withdrawBackupLink'>
            <FormattedMessage
              id='modals.send.firststep.backupnow'
              defaultMessage='Backup now.'
            />
          </BackupLink>
        </BackupCopy>
      </CustomBlueCartridge>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(MnemonicRequiredForCustodySend)
