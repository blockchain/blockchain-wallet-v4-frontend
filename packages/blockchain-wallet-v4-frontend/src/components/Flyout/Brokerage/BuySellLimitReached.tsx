import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'

const Title = styled(Text)`
  margin: 56px 0 16px 0;
  text-align: center;
`

const SubContent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`

const BuySellLimitReached: React.FC<Props> = ({ handleClose, limitNumber }) => (
  <FlyoutContainer>
    <FlyoutHeader mode='close' data-e2e='BSLimitReachedHeader' onClick={handleClose} />
    <FlyoutContent mode='middle'>
      <div style={{ textAlign: 'center' }}>
        <Image
          width='48px'
          height='48px'
          name='world-alert'
          srcset={{ 'world-alert2': '2x', 'world-alert3': '3x' }}
        />
        <Title color='grey800' size='20px' weight={600}>
          <FormattedMessage
            id='modals.simplebuy.limit_reached_title'
            defaultMessage="You've reached your limit"
          />
        </Title>
        <SubContent color='grey600' weight={500}>
          <FormattedMessage
            id='modals.simplebuy.limit_reached_sub_title'
            defaultMessage='The maximum amount of pending orders is {limitNumber}'
            values={{ limitNumber }}
          />
        </SubContent>
      </div>
      <FlyoutFooter>
        <Button
          data-e2e='closeBSLimitReached'
          height='48px'
          size='16px'
          nature='primary'
          onClick={handleClose}
          fullwidth
        >
          <FormattedMessage id='buttons.ok' defaultMessage='OK' />
        </Button>
      </FlyoutFooter>
    </FlyoutContent>
  </FlyoutContainer>
)

export type Props = {
  handleClose: () => void
  limitNumber: number
}

export default BuySellLimitReached
