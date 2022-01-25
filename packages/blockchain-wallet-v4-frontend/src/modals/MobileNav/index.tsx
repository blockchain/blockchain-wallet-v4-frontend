import React from 'react'
import { FormattedMessage } from 'react-intl'
import { compose } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import Flyout, { duration, FlyoutContainer, FlyoutContent, FlyoutHeader } from 'components/Flyout'
import { MobileNav } from 'components/NavbarV2'
import { OptionRightActionRow } from 'components/Rows'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

const rows: Array<RowType> = [
  {
    description: (
      <FormattedMessage
        id='modals.trade.swap.description'
        defaultMessage='Exchange Crypto for Another'
      />
    ),
    handleClick: () => {},
    header: <FormattedMessage id='buttons.swap' defaultMessage='Swap' />,
    iconName: 'swap'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.send.description'
        defaultMessage='Transfer to Another Wallet'
      />
    ),
    handleClick: () => {},
    header: <FormattedMessage id='buttons.send' defaultMessage='Send' />,
    iconName: 'send'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.receive.receive_crypto'
        defaultMessage='Receive Crypto to Your Wallet'
      />
    ),
    handleClick: () => {},
    header: <FormattedMessage id='buttons.receive' defaultMessage='Receive' />,
    iconName: 'receive'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.receive.add_cash'
        defaultMessage='Add Cash to Your Cash Account'
      />
    ),
    handleClick: () => {},
    header: <FormattedMessage id='buttons.deposit' defaultMessage='Deposit' />,
    iconName: 'deposit'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.receive.cash_out'
        defaultMessage='Cash Out to Your Bank Account'
      />
    ),
    handleClick: () => {},
    header: <FormattedMessage id='buttons.withdraw' defaultMessage='Withdraw' />,
    iconName: 'withdraw'
  }
]

class MobileNavContainer extends React.PureComponent<Props> {
  state = { show: false }

  componentDidMount() {
    this.setState({ show: true }) //eslint-disable-line
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    const { show } = this.state
    const { ...rest } = this.props
    return (
      <Flyout {...rest} onClose={this.props.close} isOpen={show} data-e2e='tradeModal'>
        {/* <MobileNav handleClose={this.handleClose} /> */}
      </Flyout>
    )
  }
}

type OwnPropsType = {
  close: () => void
  position: number
  total: number
  userClickedOutside: boolean
}

type RowType = {
  description: JSX.Element
  handleClick: () => void
  header: JSX.Element
  iconName: string
}

type Props = OwnPropsType

const enhance = compose<any>(modalEnhancer(ModalName.MOBILE_NAV))

export default enhance(MobileNavContainer)
