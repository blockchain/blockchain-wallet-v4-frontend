import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { actions } from 'data'

import IconButton from './IconButton'
import Balance from './Balance'

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  widtH: 100%;
  height: 115px;
  padding: 20px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.colors.gray.lighter};
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
    console.log('click')
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
            <IconButton icon='icon-send' className='margin-right-10' click={this.openSendBitcoin}>
              <FormattedMessage id='components.layouts.wallet.menutop.sendbitcoin.send' defaultMessage='Send' />
            </IconButton>
            <IconButton icon='icon-receive' className='left' onClick={this.openRequestBitcoin}>
              <FormattedMessage id='components.layouts.wallet.menutop.requestbitcoin.request' defaultMessage='Request' />
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
