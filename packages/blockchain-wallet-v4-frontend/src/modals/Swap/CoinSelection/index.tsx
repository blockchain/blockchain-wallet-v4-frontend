import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { Props as BaseProps } from '..'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'

const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`

class CoinSelection extends PureComponent<Props> {
  state = {}

  render () {
    return (
      <FlyoutWrapper>
        <TopText>
          <Icon
            role='button'
            name='arrow-left'
            size='24px'
            color='grey600'
            onClick={() =>
              this.props.swapActions.setStep({
                step: 'ENTER_AMOUNT',
                options: {}
              })
            }
          />{' '}
          <Text
            size='20px'
            color='grey900'
            weight={600}
            style={{ marginLeft: '24px' }}
          >
            <FormattedMessage id='copy.swap' defaultMessage='Swap' />{' '}
            {this.props.side === 'BASE' ? 'from' : 'to'}
          </Text>
        </TopText>
      </FlyoutWrapper>
    )
  }
}

type OwnProps = BaseProps & {
  handleClose: () => void
  side: 'BASE' | 'COUNTER'
}
export type Props = OwnProps

export default CoinSelection
