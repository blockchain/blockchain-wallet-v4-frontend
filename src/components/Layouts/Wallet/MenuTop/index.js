import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { actions } from 'data'

import RequestBitcoin from 'modals/RequestBitcoin'
import { IconButton } from 'components/Shared/Button'
import Balance from './Balance'

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 115px;
  padding: 20px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid gray;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-top: 10px;
`

class MenuTop extends React.Component {
  constructor (props) {
    super(props)
    this.openSendBitcoin = this.openSendBitcoin.bind(this)
    this.openRequestBitcoin = this.openRequestBitcoin.bind(this)
  }

  openSendBitcoin () {
    this.props.actions.toggleModal({ modalType: 'sendBitcoin' })
  }

  openRequestBitcoin () {
    this.props.actions.toggleModal({ modalType: 'requestBitcoin' })
  }

  render () {
    return (
      <Menu>
        <div>
          <span className='h5 text-uppercase'>Be your own bank.</span>
          <Actions>
            <IconButton icon='icon-send' className='margin-right-10' onClick={this.openSendBitcoin}>
              <FormattedMessage id='components.layouts.wallet.menutop.send' defaultMessage='Send' />
            </IconButton>
            <RequestBitcoin />
            <IconButton icon='icon-receive' className='left' onClick={this.openRequestBitcoin}>
              <FormattedMessage id='components.layouts.wallet.menutop.request' defaultMessage='Request' />
            </IconButton>
            <IconButton icon='icon-success' className='right' />
          </Actions>
        </div>
        <div>
          <Balance />
        </div>
      </Menu>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MenuTop)
