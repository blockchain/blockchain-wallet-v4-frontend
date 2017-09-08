import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Color, Button, Image, Link, Modal, SimpleSlider, Text } from 'blockchain-info-components'
import ComboDisplay from 'components/ComboDisplay'
import modalEnhancer from 'providers/ModalEnhancer'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 100%;

  & > * { padding: 10px 0; }
`
const Center = styled.div`
  text-align: center;
`
const BlockWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  height: auto;
  padding: 10px 0;
  box-sizing: border-box;
`
const FlipperBlock = styled.div`
  width: 190px;
  height: 190px;
`
const FlipContainer = styled(FlipperBlock)`
  perspective: 1000px;
  background-color: ${props => props.selected ? Color('white') : Color('brand-primary')};
  border: 1px solid white;
  cursor: pointer;

  &:hover > * {
    transform: rotateY(180deg);
  }
`

const Flipper = styled.div`
  transition: 0.6s;
  transform-style: preserve-3d;
  position: relative;
  width: 100%;
  height: 100%;
`
const FlipperFace = styled(FlipperBlock)`
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;

`
const FlipperFront = styled(FlipperFace)`
  z-index: 2;
  transform: rotateY(0deg);
`
const FlipperBack = styled(FlipperFace)`
  transform: rotateY(180deg);
`

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  padding: 5px 0;

  & > * { justify-content: center; margin-top: 10px; }
`

const Donation = (props) => {
  const { handleBack, handleSelect, handleClick, handleSlide, donation, percentage, charity, ...rest } = props

  const globalGivingSelected = charity === 'Global Giving'
  const worldLandTrustSelected = charity === 'World Land Trust'
  const techSoupSelected = charity === 'Tech Soup'

  console.log(percentage, charity)

  return (
    <Modal {...rest} icon='send' title='Donate' nature='primary'>
      <Container>
        <Text size='16px' color='white' weight={200}>
          <FormattedMessage id='modals.Donation.donate' defaultMessage='See what adding a portion of your transaction will do for those in need.' />
        </Text>
        <SimpleSlider min='0.01' max='1' step='0.01' onInput={handleSlide} value={percentage} />
        <Center>
          <Text size='18px' color='white' weight={300}>
            <ComboDisplay>{donation}</ComboDisplay>
          </Text>
        </Center>
        <BlockWrapper>
          <FlipContainer onClick={() => handleSelect('Global Giving')} selected={globalGivingSelected}>
            <Flipper>
              <FlipperFront>
                <Text size='16px' weight={300} color={globalGivingSelected ? 'brand-primary' : 'white'}>Global Giving</Text>
                <Image name='logo-global-giving' width='60%' />
              </FlipperFront>
              <FlipperBack>
                <Text size='16px' weight={300} color={globalGivingSelected ? 'brand-primary' : 'white'}>GlobalGiving</Text>
                <Text size='11px' weight={300} color={globalGivingSelected ? 'brand-primary' : 'white'}>Each month they feature a new impactful project. Past projects include  sending 1,000 kids with disabilities to school in India and providing clean water for 1,500 people in rural Senegal.</Text>
              </FlipperBack>
            </Flipper>
          </FlipContainer>
          <FlipContainer onClick={() => handleSelect('World Land Trust')} selected={worldLandTrustSelected}>
            <Flipper>
              <FlipperFront>
                <Text size='16px' weight={300} color={worldLandTrustSelected ? 'brand-primary' : 'white'}>World Land Trust</Text>
                <Image name='logo-world-land-trust' width='60%' />
              </FlipperFront>
              <FlipperBack>
                <Text size='16px' weight={300} color={worldLandTrustSelected ? 'brand-primary' : 'white'}>World Land Trust</Text>
                <Text size='11px' weight={300} color={worldLandTrustSelected ? 'brand-primary' : 'white'}>They work to protect some of the world’s most biodiverse and threatened habitats acre by acre through the protection and restoration of degraded habitats.</Text>
              </FlipperBack>
            </Flipper>
          </FlipContainer>
          <FlipContainer onClick={() => handleSelect('Tech Soup')} selected={techSoupSelected}>
            <Flipper>
              <FlipperFront>
                <Text size='16px' weight={300} color={techSoupSelected ? 'brand-primary' : 'white'}>Tech Soup</Text>
                <Image name='logo-tech-soup' width='60%' />
              </FlipperFront>
              <FlipperBack>
                <Text size='16px' weight={300} color={techSoupSelected ? 'brand-primary' : 'white'}>Tech Soup</Text>
                <Text size='11px' weight={300} color={techSoupSelected ? 'brand-primary' : 'white'}>They have reached 851,000 organizations with the tools they need to improve lives and have delivered more than $7.6 billion in technological tools and philanthropic services.</Text>
              </FlipperBack>
            </Flipper>
          </FlipContainer>
        </BlockWrapper>
      </Container>
      <Footer>
        <Button onClick={handleClick} nature='primary' fullwidth uppercase>
          <FormattedMessage id='modals.Donation.send' defaultMessage='Add this donation to my transaction' />
        </Button>
        <Link onClick={handleBack} uppercase size='13px' color='white' weight={300}>
          <FormattedMessage id='modals.Donation.back' defaultMessage='Go back' />
        </Link>
      </Footer>
    </Modal>
  )
}

Donation.propTypes = {
  handleBack: PropTypes.func
}


const enhance = modalEnhancer('Donation')

export default enhance(Donation)
