import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { Props as OwnProps } from '..'

const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`
const SelectionContainer = styled.div`
  margin-top: 36px;
`
const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${props => `1px solid ${props.theme.grey000}`};
  padding: 16px 40px;
  cursor: pointer;
`

class EnterAmount extends PureComponent<Props> {
  state = {}

  render () {
    return (
      <>
        <FlyoutWrapper>
          <TopText>
            <Icon name='arrow-switch-thick' color='blue600' size='24px' />
            <Icon
              name='close'
              color='grey600'
              role='button'
              onClick={this.props.handleClose}
            />
          </TopText>
          <Text size='24px' color='grey900' weight={600}>
            <FormattedMessage id='copy.new_swap' defaultMessage='New Swap' />
          </Text>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            style={{ marginTop: '10px' }}
          >
            <FormattedMessage
              id='copy.select_swap_wallets'
              defaultMessage='Select the Wallet you want to Swap from and the crypto you want to receive.'
            />
          </Text>
        </FlyoutWrapper>
        <SelectionContainer>
          <Option
            role='button'
            onClick={() =>
              this.props.swapActions.setStep({
                step: 'COIN_SELECTION',
                options: {
                  side: 'BASE'
                }
              })
            }
          >
            <div>
              <Text color='grey600' weight={500} size='14px'>
                Swap from
              </Text>
              <Text color='grey900' weight={600} style={{ marginTop: '4px' }}>
                Select a Wallet
              </Text>
              <Text
                color='grey900'
                weight={600}
                size='14px'
                style={{ marginTop: '4px' }}
              >
                This is the crypto you send.
              </Text>
            </div>
            <Icon name='chevron-right' size='20px' color='grey400' />
          </Option>
          <Option
            role='button'
            onClick={() =>
              this.props.swapActions.setStep({
                step: 'COIN_SELECTION',
                options: {
                  side: 'COUNTER'
                }
              })
            }
          >
            <div>
              <Text color='grey600' weight={500} size='14px'>
                Receive to
              </Text>
              <Text color='grey900' weight={600} style={{ marginTop: '4px' }}>
                Select a Wallet
              </Text>
              <Text
                color='grey900'
                weight={600}
                size='14px'
                style={{ marginTop: '4px' }}
              >
                This is the crypto you get.
              </Text>
            </div>
            <Icon name='chevron-right' size='20px' color='grey400' />
          </Option>
        </SelectionContainer>
      </>
    )
  }
}

export type Props = OwnProps & { handleClose: () => void }

export default EnterAmount
