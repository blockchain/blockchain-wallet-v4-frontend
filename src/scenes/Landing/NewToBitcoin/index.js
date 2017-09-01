import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Image, Link, Text, TextGroup } from 'blockchain-info-components'
import Container from 'components/Container'

const Wrapper = styled.div`
  background-color: ${props => props.theme['white']};
  padding: 50px 0;
`

const NewContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media(min-width: 768px) { flex-direction: row; }
`
const Block = styled.div`
  flex-grow: 1;
  width: 100%;
  padding: 30px;
`
const Summary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  & > * { margin-bottom: 10px; }
`
const Network = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const Picture = styled(Image)`
  max-width: 80%;
`

const NewToBitcoin = (props) => {
  return (
    <Wrapper>
      <NewContainer>
        <Block>
          <Summary>
            <Text size='30px' weight={200} uppercase>
              <FormattedMessage id='scenes.landing.newtobitcoin.new' defaultMessage='New to digital currencies ?' />
            </Text>
            <TextGroup inline>
              <Text size='16px' weight={300}>
                <FormattedMessage id='scenes.landing.newtobitcoin.current' defaultMessage='Like paper money and gold before it, bitcoin is a currency that allows parties to exchange value.' />
              </Text>
              <Text size='16px' weight={300}>
                <FormattedMessage id='scenes.landing.newtobitcoin.decentralized' defaultMessage="Unlike it's predecessors, bitcoin is digital and decentralized." />
              </Text>
              <Text size='16px' weight={300}>
                <FormattedMessage id='scenes.landing.newtobitcoin.history' defaultMessage='For the first time in history, people can exchange value without intermediaries which translates to greater control of funds and lower fees.' />
              </Text>
            </TextGroup>
            <Link href='https://blockchain.info/wallet/bitcoin-faq' uppercase>
              <FormattedMessage id='scenes.landing.newtobitcoin.learnmore' defaultMessage='Learn more' />
              <Icon name='right_arrow' color='iris' />
            </Link>
          </Summary>
        </Block>
        <Block>
          <Network>
            <Picture name='bitcoin-network' />
          </Network>
        </Block>
      </NewContainer>
    </Wrapper>
  )
}

export default NewToBitcoin
