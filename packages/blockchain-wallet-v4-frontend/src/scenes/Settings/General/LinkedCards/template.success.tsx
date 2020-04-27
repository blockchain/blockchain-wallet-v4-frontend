import { Button } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import {
  SettingComponent,
  SettingContainer,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { SuccessStateType } from '.'
import React from 'react'

const Success: React.FC<Props> = props => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.settings.linked_cards'
            defaultMessage='Linked Cards'
          />
        </SettingHeader>
        {props.cards.map((card, i) => {
          return (
            <div key={i}>{card.state === 'ACTIVE' ? card.card.number : ''}</div>
          )
        })}
      </SettingSummary>
      <SettingComponent>
        <Button nature='empty' data-e2e='addCardFromSettings'>
          <FormattedMessage
            id='scenes.lockbox.settings.adddevice.add'
            defaultMessage='Add Device'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

type Props = SuccessStateType

export default Success
