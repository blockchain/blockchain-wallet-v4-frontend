import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import { Container } from 'components/Box'
import {
  HeaderTextWrapper,
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText
} from 'components/Layout'

import { Props as IProps } from '.'
import ExchangeConnect from './template.connect'
import ExchangeInfo from './template.info'

const Wrapper = styled.div`
  width: 100%;
`

type OwnProps = {
  onSignup: () => void
}

export type Props = OwnProps & IProps

const Exchange = (props: Props) => (
  <Wrapper>
    <SceneHeader>
      <HeaderTextWrapper>
        <IconBackground>
          <Icon name='blockchain-logo' color='blue600' size='26px' />
        </IconBackground>
        <SceneHeaderText>
          <FormattedMessage
            id='scenes.exchange.blockchain'
            defaultMessage='Exchange'
          />
        </SceneHeaderText>
      </HeaderTextWrapper>
    </SceneHeader>
    <SceneSubHeaderText>
      <FormattedMessage
        id='scenes.exchange.subheader'
        defaultMessage='We built our own exchange that defines speed, reliability and liquidity. Upgrade your trading.'
      />
    </SceneSubHeaderText>
    <Container>
      <ExchangeInfo />
      <ExchangeConnect {...props} />
    </Container>
  </Wrapper>
)

export default Exchange
