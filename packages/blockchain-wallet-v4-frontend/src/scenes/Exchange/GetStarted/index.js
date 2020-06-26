import { Box, Container } from 'components/Box'
import { Button, Carousel, Image, Link, Text } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import React from 'react'
import StatusBar from './StatusBar'
import styled from 'styled-components'

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 82px;
  & > :first-child {
    margin-bottom: 10px;
  }
`
const Slide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 230px;
  img {
    align-self: flex-end;
    justify-self: flex-end;
  }
`

const GetStarted = ({ step }) => {
  return (
    <Container>
      <Box>
        <Carousel height={230} arrows={false} chips={false}>
          <Slide>
            <div>
              <Text
                size='20px'
                weight={600}
                color='grey800'
                style={{ marginBottom: '10px' }}
              >
                <FormattedMessage
                  id='swap.carousel.title.page2'
                  defaultMessage='Real-time Exchange Rates'
                />
              </Text>
              <Text
                size='14px'
                weight={500}
                color='grey600'
                style={{ lineHeight: 1.5 }}
              >
                <FormattedMessage
                  id='swap.carousel.desc.page2'
                  defaultMessage='Access competitive crypto prices right at your fingertips.'
                />
              </Text>
            </div>
            <Image name='swap-carousel2' width='160px' />
          </Slide>
          <Slide>
            <div>
              <Text
                size='20px'
                weight={600}
                color='grey800'
                style={{ marginBottom: '10px' }}
              >
                <FormattedMessage
                  id='swap.carousel.title.page3'
                  defaultMessage='100% On-Chain'
                />
              </Text>
              <Text
                size='14px'
                weight={500}
                color='grey600'
                style={{ lineHeight: 1.5 }}
              >
                <FormattedMessage
                  id='swap.carousel.desc.page3'
                  defaultMessage='All Swap trades are confirmed and settled directly on-chain.'
                />
              </Text>
            </div>
            <Image name='swap-carousel3' width='160px' />
          </Slide>
          <Slide>
            <div>
              <Text
                size='20px'
                weight={600}
                color='grey800'
                style={{ marginBottom: '10px' }}
              >
                <FormattedMessage
                  id='swap.carousel.title.page4'
                  defaultMessage='You Control Your Key'
                />
              </Text>
              <Text
                size='14px'
                weight={500}
                color='grey600'
                style={{ lineHeight: 1.5 }}
              >
                <FormattedMessage
                  id='swap.carousel.desc.page4'
                  defaultMessage='With Swap your crypto is safe, secure, and your keys are always intact.'
                />
              </Text>
            </div>
            <Image name='swap-carousel4' width='160px' />
          </Slide>
          <Slide>
            <div>
              <Text
                size='20px'
                weight={600}
                color='grey800'
                style={{ marginBottom: '10px' }}
              >
                <FormattedMessage
                  id='swap.carousel.title.page5'
                  defaultMessage='Manage Risk Better'
                />
              </Text>
              <Text
                size='14px'
                weight={500}
                color='grey600'
                style={{ lineHeight: 1.5 }}
              >
                <FormattedMessage
                  id='swap.carousel.desc.page5-1'
                  defaultMessage='Introducing Digital Dollars (USD Digital) to de-risk your crypto investment or lock-in gains.'
                />
              </Text>
            </div>
            <Image name='swap-carousel5' width='160px' />
          </Slide>
        </Carousel>
      </Box>
      <Box>
        <div>
          <Text
            size='20px'
            weight={600}
            color='grey800'
            style={{ marginBottom: '10px' }}
          >
            <FormattedMessage
              id='swap.getstarted.readytoswap.title'
              defaultMessage='Ready to Swap? '
            />
          </Text>
          <Text
            size='14px'
            weight={500}
            color='grey600'
            style={{ lineHeight: 1.5 }}
          >
            <FormattedMessage
              id='swap.getstarted.readytoswap.body'
              defaultMessage='Complete your profile and start exchanging cryptocurrencies today.'
            />
          </Text>
        </div>
        <ButtonsContainer>
          <StatusBar step={step} />
          <Link
            href='https://support.blockchain.com/hc/en-us/articles/360018080172-Identity-Verification-Overview'
            target='_blank'
          >
            <Button nature='empty' width='264px' height='48px'>
              <Text weight={600} color='blue600'>
                <FormattedMessage
                  id='buttons.learn_more'
                  defaultMessage='Learn More'
                />
              </Text>
            </Button>
          </Link>
        </ButtonsContainer>
      </Box>
    </Container>
  )
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(GetStarted)
