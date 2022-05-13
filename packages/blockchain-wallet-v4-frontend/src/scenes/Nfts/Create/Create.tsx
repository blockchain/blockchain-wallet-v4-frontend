import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon } from '@blockchain-com/constellation'
import { IconBlockchain } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions } from 'data'
import { media, useMedia } from 'services/styles'

import { maxWidth, NftPageV2 } from '../components'

const Banner = styled.div`
  background: linear-gradient(180deg, #e6e1ff 0%, rgba(250, 251, 255, 0) 100%);
  height: 400px;
  width: 100%;
  box-sizing: border-box;
  display: block;
  align-items: center;
  padding: 100px 64px;
`

const Footer = styled.div`
  background: linear-gradient(0deg, #e6e1ff 0%, rgba(250, 251, 255, 0) 100%);
  height: 200px;
  width: 100%;
  box-sizing: border-box;
  display: block;
  align-items: center;
  padding: 100px 64px;
`

const Body = styled.div`
  box-sizing: border-box;
  display: block;
  align-items: center;
`

const Create: React.FC<Props> = (props) => {
  const isMobile = useMedia('mobile')
  const isTablet = useMedia('tablet')
  return (
    <NftPageV2 style={{ padding: 'unset' }}>
      <Banner>
        <Flex gap={24} justifyContent='space-around'>
          <div>
            <div style={{ alignItems: 'center', display: 'flex', marginBottom: '16px' }}>
              <Icon label='logo'>
                <IconBlockchain />
              </Icon>
              &nbsp;|&nbsp;
              <Text color='black' size='20px' weight={600}>
                NFT
              </Text>
            </div>
            <Text size={isTablet || isMobile ? '20px' : '40px'} weight={600} color='black'>
              Create NFTs.
            </Text>

            <Text
              style={{
                lineHeight: '20px',
                marginTop: '8px',
                maxWidth: '500px',
                textAlign: 'left'
              }}
              size='16px'
              weight={500}
              color='grey900'
            >
              Discover a new way to materialize your work and get the world to know your true
              potential.
            </Text>
            <LinkContainer to='/nfts/create' style={{ marginTop: '16px' }}>
              <Button nature='primary' data-e2e='Create'>
                <FormattedMessage id='copy.explore' defaultMessage='Apply Now' />
              </Button>
            </LinkContainer>
          </div>
          <Image
            // @ts-ignore
            name='cryptoad-2456'
            width='155px'
            style={{ padding: '5em 3em' }}
          />
        </Flex>
      </Banner>
      <Body>
        <Flex justifyContent='space-around'>
          <div style={{ alignItems: 'center', display: 'flex', width: '33%' }}>
            <div style={{ display: 'block' }}>
              <Text size={isTablet || isMobile ? '20px' : '40px'} weight={600} color='black'>
                Bring Your Creations To Digital Life.
              </Text>
              <Text
                style={{
                  lineHeight: '20px',
                  marginTop: '8px',
                  maxWidth: '500px',
                  textAlign: 'left'
                }}
                size='16px'
                weight={500}
                color='grey900'
              >
                Create your NFT Art quickly and easy. Unleash your true potential and be discovered.
              </Text>
            </div>
          </div>
          <Image
            // @ts-ignore
            name='cryptoad-2456'
            width='155px'
            style={{ padding: '5em 3em' }}
          />
        </Flex>
        <Flex justifyContent='space-around'>
          <Image
            // @ts-ignore
            name='cryptoad-2456'
            width='155px'
            style={{ padding: '5em 3em' }}
          />
          <div style={{ alignItems: 'center', display: 'flex' }}>
            <div style={{ display: 'block' }}>
              <Text size={isTablet || isMobile ? '20px' : '40px'} weight={600} color='black'>
                Get Paid What You’re Worth.
              </Text>
              <Text
                style={{
                  lineHeight: '20px',
                  marginTop: '8px',
                  maxWidth: '500px',
                  textAlign: 'left'
                }}
                size='16px'
                weight={500}
                color='grey900'
              >
                NFTs give you the chance to receive a cut of secondary market sales. With us,
                everytime your work is bought and sold, you receive a percentage of the sales.
              </Text>
            </div>
          </div>
        </Flex>
        <Flex justifyContent='space-around'>
          <div style={{ alignItems: 'center', display: 'flex' }}>
            <div style={{ display: 'block' }}>
              <Text size={isTablet || isMobile ? '20px' : '40px'} weight={600} color='black'>
                You Create It, We Build It.
              </Text>
              <Text
                style={{
                  lineHeight: '20px',
                  marginTop: '8px',
                  maxWidth: '500px',
                  textAlign: 'left'
                }}
                size='16px'
                weight={500}
                color='grey900'
              >
                We don’t want you to worry about all the programming, that’s on us. We handle all of
                the coding pieces for you, meaning that selling your art with us is as easy as
                selling something on Amazon.
              </Text>
            </div>
          </div>
          <Image
            // @ts-ignore
            name='cryptoad-2456'
            width='155px'
            style={{ padding: '5em 3em' }}
          />
        </Flex>
      </Body>
      <Footer>
        <Flex gap={24} justifyContent='center'>
          <Text
            color='grey900'
            size='40px'
            weight={600}
            style={{ alignItems: 'center', display: 'flex' }}
          >
            Ready To Stand Out?
          </Text>
          <LinkContainer to='/nfts/create'>
            <Button jumbo nature='primary' data-e2e='Create'>
              <FormattedMessage id='copy.explore' defaultMessage='Apply Now' />
            </Button>
          </LinkContainer>
        </Flex>
      </Footer>
    </NftPageV2>
  )
}

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Create)
