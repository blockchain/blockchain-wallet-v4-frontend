import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from '@blockchain-com/constellation'

import { CoinType } from '@core/types'
import { Icon, Image, Link, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { Bottom, Container, Row, Top, TopText, WarningContainer, Wrapper } from './Warning.model'

const Warning = ({ coin, handleClick, handleClose, unbondingDays }: OwnProps) => (
  <Wrapper>
    <FlyoutWrapper>
      <TopText color='grey800' size='20px' weight={600}>
        <Row>
          <FormattedMessage
            id='modals.staking.title'
            defaultMessage='Stake {coin}'
            values={{ coin }}
          />
        </Row>
        <Icon
          onClick={handleClose}
          cursor
          name='close'
          size='20px'
          color='grey600'
          data-e2e='closeStaking'
        />
      </TopText>
    </FlyoutWrapper>
    <Top>
      <Container>
        <Image name='eth-locked' size='68px' />
        <Text color='grey900' size='20px' weight={600}>
          <FormattedMessage
            defaultMessage='Staking considerations'
            id='modals.staking.warning.content.title'
          />
        </Text>
        <Text color='grey600' size='16px' weight={500}>
          <FormattedMessage
            defaultMessage='Your staked {coin} will start generating rewards after an initial bonding period. {br}{br} Unstaking and withdrawing {coin} can take up to {unbondingDays} {days} depending on the network queue.'
            id='modals.staking.warning.content.subtitles'
            values={{
              br: <br />,
              coin,
              days:
                unbondingDays > 1 ? (
                  <FormattedMessage
                    defaultMessage='days'
                    id='modals.staking.warning.content.subtitle.days'
                  />
                ) : (
                  <FormattedMessage
                    defaultMessage='day'
                    id='modals.staking.warning.content.subtitle.day'
                  />
                ),
              unbondingDays
            }}
          />
        </Text>
      </Container>
    </Top>
    <Bottom>
      <WarningContainer>
        <Text color='grey900' size='12px' weight={500}>
          <FormattedMessage
            defaultMessage='These rules are not specific to Blockchain.com. They’re features of the Ethereum network.'
            id='modals.staking.warning.bottom.warning'
          />
        </Text>
        <Link href='https://ethereum.org/en/staking/' target='_blank'>
          <Button
            size='small'
            text={<FormattedMessage defaultMessage='Learn More' id='buttons.learn_more' />}
            type='button'
            variant='secondary'
          />
        </Link>
      </WarningContainer>
      <Button
        onClick={handleClick}
        size='default'
        text={<FormattedMessage defaultMessage='Continue' id='copy.continue' />}
        type='button'
        variant='primary'
        width='full'
      />
    </Bottom>
  </Wrapper>
)

type OwnProps = {
  coin: CoinType
  handleClick: () => void
  handleClose: () => void
  unbondingDays: number
}

export default Warning
