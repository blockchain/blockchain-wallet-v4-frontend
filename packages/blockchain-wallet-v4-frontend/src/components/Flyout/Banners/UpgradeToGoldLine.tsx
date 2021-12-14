import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.blue400};
  border-radius: 12px;
  padding: 16px 18px;
  margin: 10px 0;

  ${media.atLeastLaptop`
    height: 72px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
    flex-direction: column;
  `}
`
const Row = styled.div`
  display: flex;
  align-items: center;
`

const SpacedRow = styled(Row)`
  justify-content: space-between;
  width: 100%;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const PendingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
`

// reset min-width from Button component
const BannerButton = styled(Button)`
  height: 32px;
  width: 46px;
  font-size: 14px;
  border-radius: 42px;
  min-width: 0;
`
export enum Flows {
  BUY = 'BUY',
  SEND = 'SEND',
  SWAP = 'SWAP'
}

const getLabelBasedOnType = (type: Flows) => {
  if (type === Flows.SEND) {
    return <FormattedMessage id='copy.send_upgrade' defaultMessage='Get Unlimited Sends' />
  }

  if (type === Flows.SWAP) {
    return <FormattedMessage id='copy.swap_upgrade.more_crypto' defaultMessage='Swap More Crypto' />
  }

  if (type === Flows.BUY) {
    return <FormattedMessage id='copy.buy_upgrade' defaultMessage='Buy More Crypto' />
  }
}

const UpgradeToGoldLine = ({ type, verifyIdentity }: Props) => {
  return (
    <Wrapper>
      <SpacedRow>
        <PendingIconWrapper>
          <Image name='tier-gold' size='32px' />
        </PendingIconWrapper>
        <Column>
          <Text size='12px' weight={500} color='grey900'>
            {getLabelBasedOnType(type)}
          </Text>
          <Text size='14px' weight={500} color='grey900'>
            <FormattedMessage id='copy.upgrade_your_wallet' defaultMessage='Upgrade Your Wallet' />
          </Text>
        </Column>
        <BannerButton onClick={verifyIdentity} data-e2e='continueToGold' nature='primary'>
          <FormattedMessage id='buttons.go' defaultMessage='Go' />
        </BannerButton>
      </SpacedRow>
    </Wrapper>
  )
}

type Props = { type: Flows; verifyIdentity: () => void }

export default UpgradeToGoldLine
