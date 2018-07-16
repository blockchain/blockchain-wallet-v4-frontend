import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Image, Link, TabMenu, TabMenuItem, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  @media(min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const Partner = styled(TextGroup)`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  @media(max-width: 992px) { display: none; }
`

const TabMenuBuySellStatus = props => {
  const { handleClick, partner, value } = props

  return (
    <Wrapper>
      <TabMenu>
        <TabMenuItem style={{ paddingLeft: '0px' }} selected={value === 'buy'} onClick={() => handleClick('buy')}>
          <FormattedMessage id='components.form.tabmenubuysell.buy' defaultMessage='Buy' />
        </TabMenuItem>
        <TabMenuItem selected={value === 'sell'} onClick={() => handleClick('sell')}>
          <FormattedMessage id='components.form.tabmenubuysell.sell' defaultMessage='Sell' />
        </TabMenuItem>
        <TabMenuItem selected={value === 'order_history'} onClick={() => handleClick('order_history')}>
          <FormattedMessage id='components.form.tabmenubuysell.orderhistory' defaultMessage='Order History' />
        </TabMenuItem>
      </TabMenu>
      {partner &&
        <Partner>
          <Text size='12px' weight={300}>
            <FormattedMessage id='scenes.exchange.menutop.poweredby' defaultMessage='Powered by' />
          </Text>
          {partner === 'sfox'
            ? <Link href='https://www.sfox.com' target='_blank'>
              <Image name='sfox-logo' width='60px' height='25px' />
            </Link>
            : <Link href='https://www.coinify.com' target='_blank'>
              <Image name='coinify-logo' width='60px' height='25px' />
            </Link>
          }
        </Partner>
      }
    </Wrapper>
  )
}

TabMenuBuySellStatus.propTypes = {
  partner: PropTypes.string,
  value: PropTypes.oneOf(['buy', 'sell', 'order_history', '']),
  onClick: PropTypes.func
}

export default TabMenuBuySellStatus
