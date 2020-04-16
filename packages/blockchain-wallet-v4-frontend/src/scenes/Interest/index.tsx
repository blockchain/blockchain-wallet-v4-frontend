import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import {
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText,
  SceneWrapper
} from 'components/Layout'
import React from 'react'

class Interest extends React.PureComponent {
  render () {
    return (
      <SceneWrapper>
        <SceneHeader>
          <IconBackground>
            <Icon name='savings-icon' color='blue600' size='24px' />
          </IconBackground>
          <SceneHeaderText>
            <FormattedMessage
              id='scenes.interest.blockchain'
              defaultMessage='Earn Interest'
            />
          </SceneHeaderText>
        </SceneHeader>
        <SceneSubHeaderText>
          <FormattedMessage
            id='scenes.interest.subheader'
            defaultMessage='Deposit crypto and instantly earn interest with absolutely no fees.'
          />
        </SceneSubHeaderText>
      </SceneWrapper>
    )
  }
}

export default Interest
