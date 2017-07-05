import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { ButtonGroup } from 'react-bootstrap'

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
  border-bottom: 1px solid ${props => props.theme.grayLighter};
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-top: 10px;
`

const MenuTop = (props) => (
  <Menu>
    <div>
      <span className='h5 text-uppercase'>Be your own bank.</span>
      <Actions>
        <IconButton icon='icon-send' className='mr-10' onClick={props.openSendBitcoin}>
          <FormattedMessage id='components.layouts.wallet.menutop.send' defaultMessage='Send' />
        </IconButton>
        <ButtonGroup>
          <RequestBitcoin />
          <IconButton icon='icon-receive' onClick={props.openRequestBitcoin}>
            <FormattedMessage id='components.layouts.wallet.menutop.request' defaultMessage='Request' />
          </IconButton>
          <IconButton icon='ti-clipboard' />
        </ButtonGroup>
      </Actions>
    </div>
    <div>
      <Balance />
    </div>
  </Menu>
)

MenuTop.propTypes = {
  openSendBitcoin: PropTypes.func.isRequired,
  openRequestBitcoin: PropTypes.func.isRequired
}

export default MenuTop
