import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { Content, Status } from './styles'
import { FormattedMessage } from 'react-intl'
import { Props } from '.'
import React from 'react'

const getIcon = tier => {
  switch (tier) {
    case 1:
      return 'silver-approved'
    case 2:
      return 'gold-approved'
    default:
      return 'checkmark-green'
  }
}

const Success: React.FC<Props & { close: () => void }> = props => {
  const { close, userTiers } = props

  // @ts-ignore
  const { current } = userTiers.getOrElse({}) || {}

  return (
    <Content>
      <Icon
        cursor
        data-e2e='sbCloseModalIcon'
        name='close'
        size='20px'
        color='grey600'
        role='button'
        onClick={close}
      />
      <Image name={getIcon(current)} size='50px' />
      <Status>
        <Text color='white' size='24px' weight={600}>
          <FormattedMessage
            id='modals.onboarding.linkfromexchange.successheader'
            defaultMessage='Success!'
          />
        </Text>
        <Text color='white' weight={500}>
          <FormattedMessage
            id='modals.onboarding.linkfromexchange.success'
            defaultMessage='You have connected your Blockchain Wallet to Exchange. Go back and finish signing up!'
          />
        </Text>
      </Status>
      <Button
        nature='empty-blue'
        height='56px'
        fullwidth
        onClick={close}
        data-e2e='linkDone'
      >
        <Text color='white' size='16px' weight={500}>
          <FormattedMessage id='buttons.done' defaultMessage='Done' />
        </Text>
      </Button>
    </Content>
  )
}

export default Success
