import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { Props } from '.'

const UpgradeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Upgrade: React.FC<Props> = props => {
  return (
    <FlyoutWrapper>
      <UpgradeRow>
        <div>
          <Text size='14px' weight={500} color='grey600' lineHeight='150%'>
            <FormattedMessage
              id='copy.upgrade'
              defaultMessage='Upgrade To Gold'
            />
          </Text>
          <Text size='16px' color='grey800' weight={600} lineHeight='150%'>
            <FormattedMessage
              id='copy.swap_up_to'
              defaultMessage='Swap Up to $10,000 a Day'
            />
          </Text>
        </div>
        <Button
          data-e2e='learnMoreUpgrade'
          nature='light'
          onClick={() =>
            props.swapActions.setStep({
              step: 'UPGRADE_PROMPT'
            })
          }
          height='32px'
          width='90px'
          size='14px'
        >
          <FormattedMessage
            id='buttons.learn_more'
            defaultMessage='Learn More'
          />
        </Button>
      </UpgradeRow>
    </FlyoutWrapper>
  )
}

export default Upgrade
