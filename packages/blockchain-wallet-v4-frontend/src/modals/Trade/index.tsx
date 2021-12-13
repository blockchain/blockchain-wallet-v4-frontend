import React from 'react'
import { FormattedMessage } from 'react-intl'
import { compose } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { OptionRightActionRow } from 'components/Rows'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

const Column = styled.div`
  display: flex;
  flex-direction: column;
`
const IconWrapper = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background-color: ${({ theme }) => theme.grey100};
  height: 32px;
  width: 32px;
`
const ContentContainer = styled(Column)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 128px;

  & > div {
    width: 100%;
  }
`
const ButtonWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 40px;
  padding: 0 40px 0 32px;

  & > :first-child {
    margin-right: 16px;
  }
`

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
    iconColor: '#0C6CF2',
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
    iconColor: '#0C6CF2', // blue600
    iconName: 'send'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.receive.description'
        defaultMessage='Receive Crypto to Your Wallet'
      />
    ),
    handleClick: () => {},
    header: <FormattedMessage id='buttons.receive' defaultMessage='Receive' />,
    iconColor: '#0C6CF2', // blue600
    iconName: 'receive'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.receive.description'
        defaultMessage='Add Cash to Your Cash Account'
      />
    ),
    handleClick: () => {},
    header: <FormattedMessage id='buttons.deposit' defaultMessage='Deposit' />,
    iconColor: '#0C6CF2', // blue600
    iconName: 'deposit'
  },
  {
    description: (
      <FormattedMessage
        id='modals.trade.receive.description'
        defaultMessage='Cash Out to Your Bank Account'
      />
    ),
    handleClick: () => {},
    header: <FormattedMessage id='buttons.withdraw' defaultMessage='Withdraw' />,
    iconColor: '#0C6CF2', // blue600
    iconName: 'withdraw'
  }
]

class TradeContainer extends React.PureComponent<Props> {
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
        <FlyoutChild>
          <IconWrapper onClick={this.handleClose}>
            <Icon name='close' color='grey600' role='button' data-e2e='close' size='24px' cursor />
          </IconWrapper>
          <ContentContainer>
            {rows.map(({ description, handleClick, header, iconColor, iconName }) => (
              <OptionRightActionRow
                iconColor={iconColor}
                iconName={iconName}
                key={iconName}
                onClick={handleClick}
              >
                <Text color='grey900' weight={600}>
                  {header}
                </Text>
                <Text color='grey600' size='14px' weight={500}>
                  {description}
                </Text>
              </OptionRightActionRow>
            ))}
          </ContentContainer>
          <ButtonWrapper>
            <Button
              capitalize
              data-e2e='toSimpleBuyModal'
              fullwidth
              height='48px'
              nature='primary'
              size='16px'
            >
              <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
            </Button>
            <Button
              capitalize
              data-e2e='skipTour'
              fullwidth
              height='48px'
              nature='dark'
              size='16px'
            >
              <FormattedMessage id='buttons.sell' defaultMessage='Sell' />
            </Button>
          </ButtonWrapper>
        </FlyoutChild>
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
  iconColor: string
  iconName: string
}

type Props = OwnPropsType

const enhance = compose<any>(modalEnhancer(ModalName.TRADE_MODAL, { transition: duration }))

export default enhance(TradeContainer)
