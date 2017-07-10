import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ButtonGroup } from 'react-bootstrap'

import RequestBitcoin from 'modals/RequestBitcoin'
import { IconButton } from 'components/legacy/Button'
import { Text } from 'components/generic/Text'
import Balance from './Balance'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
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
  <Wrapper>
    <div>
      <Text id='components.layouts.wallet.menutop.bank' text='Be your own bank.' biggest />
      <Actions>
        <IconButton icon='icon-send' onClick={props.openSendBitcoin}>
          <Text id='components.layouts.wallet.menutop.send' text='Send' smaller light />
        </IconButton>
        <ButtonGroup>
          <RequestBitcoin />
          <IconButton icon='icon-receive' onClick={props.openRequestBitcoin}>
            <Text id='components.layouts.wallet.menutop.request' text='Request' smaller light />
          </IconButton>
          <IconButton icon='ti-clipboard' />
        </ButtonGroup>
      </Actions>
    </div>
    <div>
      <Balance />
    </div>
  </Wrapper>
)

MenuTop.propTypes = {
  openSendBitcoin: PropTypes.func.isRequired,
  openRequestBitcoin: PropTypes.func.isRequired
}

export default MenuTop
