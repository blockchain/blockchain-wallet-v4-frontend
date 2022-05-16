import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Icon } from '@blockchain-com/constellation'
import { IconBlockchain } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
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
  padding: 50px 64px;
  ${media.mobile`
    height: unset;
    padding: 50px 32px;
  `};
`
const Body = styled.div`
  box-sizing: border-box;
  display: block;
  align-items: center;
  padding: 100px 64px;
  ${media.tablet`
    padding: 0px 32px;
  `};
`
const Footer = styled.div`
  background: linear-gradient(0deg, #e6e1ff 0%, rgba(250, 251, 255, 0) 100%);
  height: 100px;
  width: 100%;
  box-sizing: border-box;
  display: block;
  align-items: center;
  padding: 0px 64px;
  ${media.tablet`
    height: unset;
    padding: 32px 32px;
  `};
`

const Create: React.FC<Props> = (props) => {
  const isMobile = useMedia('mobile')
  const isTablet = useMedia('tablet')
  return (
    <NftPageV2 style={{ padding: 'unset' }}>
      <Banner>
        <div
          style={
            !isMobile && !isTablet
              ? { alignItems: 'center', display: 'flex', justifyContent: 'space-evenly' }
              : {}
          }
        >
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
            <Text size={isTablet || isMobile ? '20px' : '54px'} weight={600} color='black'>
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
            name='cryptoad-large'
            width={!isMobile && !isTablet ? '380px' : '250px'}
          />
        </div>
      </Banner>
      <Body>
        <div
          style={!isMobile && !isTablet ? { display: 'flex', justifyContent: 'space-evenly' } : {}}
        >
          <div
            style={
              !isMobile && !isTablet ? { alignItems: 'center', display: 'flex', width: '33%' } : {}
            }
          >
            <div style={!isTablet || !isMobile ? { width: '90%' } : {}}>
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
            name='nft-collections'
            width={!isMobile && !isTablet ? '400px' : '250px'}
          />
        </div>
        {!isMobile && !isTablet ? (
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Image
              // @ts-ignore
              name='nft-nouns'
              width='400px'
            />
            <div style={{ alignItems: 'center', display: 'flex', width: '33%' }}>
              <div style={{ display: 'block' }}>
                <Text size='40px' weight={600} color='black'>
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
          </div>
        ) : (
          <div style={{ paddingTop: '50px' }}>
            <div style={{ display: 'block', paddingBottom: '1em' }}>
              <div style={{ display: 'block' }}>
                <Text size='20px' weight={600} color='black'>
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
            <Image
              // @ts-ignore
              name='nft-nouns'
              width='250px'
            />
          </div>
        )}
        <div
          style={
            !isMobile && !isTablet
              ? { display: 'flex', justifyContent: 'space-evenly' }
              : { paddingTop: '50px' }
          }
        >
          <div style={{ alignItems: 'center', display: 'flex' }}>
            <div style={{ display: 'block', paddingBottom: '1em' }}>
              <Text
                style={!isTablet || !isMobile ? { width: '60%' } : {}}
                size={isTablet || isMobile ? '20px' : '40px'}
                weight={600}
                color='black'
              >
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
            name='nft-paint-hyperlink'
            width='300px'
          />
        </div>
      </Body>
      <Footer>
        <div
          style={
            !isMobile && !isTablet ? { display: 'flex', gap: '24', justifyContent: 'center' } : {}
          }
        >
          <Text
            color='grey900'
            size={!isMobile && !isTablet ? '40px' : '20px'}
            weight={600}
            style={
              !isMobile && !isTablet
                ? { alignItems: 'center', display: 'flex', paddingRight: '1em' }
                : { alignItems: 'center', display: 'flex', paddingBottom: '1em' }
            }
          >
            Ready To Stand Out?
          </Text>
          <LinkContainer to='/nfts/create'>
            <Button jumbo nature='primary' data-e2e='Create'>
              <FormattedMessage id='copy.explore' defaultMessage='Apply Now' />
            </Button>
          </LinkContainer>
        </div>
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
