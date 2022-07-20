import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { AvailableCoins } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send'
import { getData } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/SelectAddress/Recents/selectors'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import { Flex } from 'components/Flex'

const Wrapper = styled(Flex)`
  flex-direction: column;
  margin-top: 50px;
`

const SubTitle = styled(Text)`
  margin: 0 0 20px;
  color: ${(props) => props.theme.grey400};
  font-style: normal;
`

const WallerWrapper = styled(Flex)`
  align-items: center;
  gap: 16px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.exchangeLogin};
  }
`

const Label = styled(Text)`
  margin: 16px 0;
`

const Recents: React.FC<Props> = (props) => {
  const {
    data: { addresses }
  } = props

  return (
    <Wrapper>
      <SubTitle size='16px' lineHeight='21px' weight={500}>
        <FormattedMessage id='plugin.send.recents_title' defaultMessage='Recents' />
      </SubTitle>
      {addresses.map((address: string) => (
        <WallerWrapper key={address}>
          <Icon size='24px' name={AvailableCoins.ETH} />
          <Label size='16px' lineHeight='21px' weight={600} color='white'>
            <CryptoAddress>{address}</CryptoAddress>
          </Label>
        </WallerWrapper>
      ))}
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  data: getData(state, AvailableCoins.ETH)
})

type OwnProps = {
  coin: string
}

const connector = connect(mapStateToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps)(Recents)
