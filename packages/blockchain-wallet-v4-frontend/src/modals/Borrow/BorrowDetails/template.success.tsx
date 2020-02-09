import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { OwnProps, SuccessStateType } from '.'
import { Text } from 'blockchain-info-components'
import React from 'react'
import Summary from './Summary'

type Props = OwnProps & SuccessStateType

const Success: React.FC<Props> = props => {
  return (
    <FlyoutWrapper>
      <Text color='grey900' size='20px' weight={600}>
        <FormattedMessage
          id='modals.borrow.details'
          defaultMessage='Borrow Details'
        />
      </Text>
      <Summary {...props} />
    </FlyoutWrapper>
  )
}

export default Success
