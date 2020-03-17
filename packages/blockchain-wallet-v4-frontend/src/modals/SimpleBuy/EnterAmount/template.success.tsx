import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { OwnProps, SuccessStateType } from '.'
import React from 'react'
import styled from 'styled-components'

type Props = OwnProps & SuccessStateType

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Success: React.FC<Props> = props => {
  return props.pairs.length ? (
    <Top>
      {/* Placeholder */}
      <TopText color='grey900' size='20px' weight={600}>
        <FormattedMessage
          id='modals.simplebuy.buycrypto'
          defaultMessage='Buy Crypto'
        />
        <Icon
          cursor
          name='close'
          size='20px'
          color='grey600'
          onClick={() => props.handleClose()}
        />
      </TopText>
    </Top>
  ) : (
    <div>This is awkward...user not eligible</div>
  )
}

export default Success
