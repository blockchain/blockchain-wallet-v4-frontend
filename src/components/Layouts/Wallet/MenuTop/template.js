import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button, ButtonGroup } from 'components/generic/Button'
import { Icon } from 'components/generic/Icon'
import { Text } from 'components/generic/Text'

import RequestBitcoin from 'modals/RequestBitcoin'
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
const Container = styled.div``
const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-top: 10px;
`

const MenuTop = (props) => (
  <Wrapper>
    <RequestBitcoin />
    <Container>
      <Text id='components.layouts.wallet.menutop.bank' text='Be your own bank.' biggest />
      <Actions>
        <Button onClick={props.openSendBitcoin}>
          <Icon name='icon-send' small />
          <Text id='components.layouts.wallet.menutop.send' text='Send' small light />
        </Button>
        <ButtonGroup>
          <Button onClick={props.openRequestBitcoin}>
            <Icon name='icon-receive' small />
            <Text id='components.layouts.wallet.menutop.request' text='Request' small light />
          </Button>
          <Button>
            <Icon name='ti-clipboard' small />
          </Button>
        </ButtonGroup>
      </Actions>
    </Container>
    <Container>
      <Balance />
    </Container>
  </Wrapper>
)

MenuTop.propTypes = {
  openSendBitcoin: PropTypes.func.isRequired,
  openRequestBitcoin: PropTypes.func.isRequired
}

export default MenuTop
