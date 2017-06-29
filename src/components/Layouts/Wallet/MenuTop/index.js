import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import IconButton from './IconButton'
import Balance from './Balance'

const grayLighter = '#eceeef'

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  widtH: 100%;
  height: 115px;
  padding: 20px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${grayLighter};
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-top: 10px;
`

const MenuTop = () => {
  return (
    <Menu>
      <div>
        <span className='h5 text-uppercase'>Be your own bank.</span>
        <Actions>
          <IconButton icon='icon-send' className='margin-right-10'>
            <FormattedMessage id='components.layouts.wallet.menutop.sendbitcoin.send' defaultMessage='Send' />
          </IconButton>
          <IconButton icon='icon-receive' className='left'>
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

export default MenuTop
