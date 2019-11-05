import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { Image, Text } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import React, { useState } from 'react'
import Slider from 'react-slick'
import StatusBar from './StatusBar'
import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  height: auto;
  padding: 25px 50px 50px;
  box-sizing: border-box;
  margin: 0 auto;

  ${media.mobile`
    padding: 0;
  `};
`

const Row = styled.div`
  display: flex;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const CarouselImgCss = css`
  position: absolute;
  right: 0;
  top: 80px;
  width: 304px;
  transition: opacity 0.4s ease-in-out;
  background: ${({ theme }) => theme['white']};
  z-index: 2;

  ${media.laptop`
    top: 0;
    right: 0;
    left: 0;
    margin: 0 auto;
  `}

  ${media.mobile`
    width: 272px;
  `}
`

const NextButton = styled.div`
  &.slick-next {
    height: 48px;
    width: 48px;
    border-bottom: 2px solid ${props => props.theme['brand-secondary']};
    border-right: 2px solid ${props => props.theme['brand-secondary']};
    transform: rotate(-45deg);
    right: -80px;
    border-bottom-right-radius: 8px;
    display: ${({ lastPage }) => (lastPage ? 'none' : 'block')};

    ${media.mobile`
      display: none;
    `};
  }
`

const PrevButton = styled.div`
  &.slick-prev {
    height: 48px;
    width: 48px;
    border-bottom: 2px solid ${props => props.theme['brand-secondary']};
    border-left: 2px solid ${props => props.theme['brand-secondary']};
    transform: rotate(45deg);
    left: -80px;
    border-bottom-left-radius: 8px;
    display: ${({ firstPage }) => (firstPage ? 'none' : 'block')};

    ${media.mobile`
      display: none;
    `};
  }
`

const CarouselWrapper = styled(Column)`
  width: 80%;
  position: relative;
  align-items: flex-start;

  .slick-slider {
    width: 100%;
  }

  .slick-slider > ul {
    bottom: 125px;
    width: fit-content;

    ${media.laptop`
      width: 100%;
    `}
  }

  .slick-slider > ul > li:first-child {
    margin-left: 0;
  }

  .slick-slider > ul > li > a > div {
    background: ${({ theme }) => theme['gray-2']};
    ${media.laptop`
      background: ${({ theme }) => theme['l']};
    `}
  }

  .slick-slider > ul > li.slick-active > a > div {
    background: ${({ theme }) => theme['brand-secondary']};
  }

  .slick-dots li button:before {
    width: 24px;
    height: 4px;
  }
`

const CarouselPageWrapper = styled(Row)`
  ${media.laptop`
    justify-content: center;
  `}
`

const Container = styled(Column)`
  width: 50%;
  height: 468px;
  justify-content: center;

  ${media.laptop`
    width: 100%;
    margin-top: 96px;
    text-align: center;
  `};
`

const Title = styled(Text)`
  margin-bottom: 10px;
  color: ${({ theme }) => theme['brand-primary']};
`

const BodyText = styled(Text)`
  padding-right: 15px;

  ${media.laptop`
    padding-right: 0;
  `}
`

const CarouselImage1 = styled(Image)`
  ${CarouselImgCss}
  opacity: ${({ currentSlide }) => (currentSlide === 0 ? 1 : 0)};
`

const CarouselImage2 = styled(Image)`
  ${CarouselImgCss}
  opacity: ${({ currentSlide }) => (currentSlide === 1 ? 1 : 0)};
`

const CarouselImage3 = styled(Image)`
  ${CarouselImgCss}
  opacity: ${({ currentSlide }) => (currentSlide === 2 ? 1 : 0)};
`

const CarouselImage4 = styled(Image)`
  ${CarouselImgCss}
  opacity: ${({ currentSlide }) => (currentSlide === 3 ? 1 : 0)};
`

const CarouselImage5 = styled(Image)`
  ${CarouselImgCss}
  opacity: ${({ currentSlide }) => (currentSlide === 4 ? 1 : 0)};
`

const Dots = styled.div`
  height: 4px;
  width: 24px;
  border-radius: 14px;

  ${media.laptop`
    width: 8px;
    height: 8px;
    border-radius: 50%;
  `}
`

const PlacementDiv = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  background: ${({ theme }) => theme['white']};
  z-index: 1;

  ${media.laptop`
    display: none;
 `}
`

const ButtonContainer = styled(Row)`
  width: 100%;
  margin-top: -72px;
  z-index: 1;
  margin-bottom: 64px;
  ${media.laptop`
    justify-content: center;
  `}
`

function NextArrow (props) {
  const { className, onClick, lastPage } = props
  return (
    <NextButton className={className} onClick={onClick} lastPage={lastPage} />
  )
}

function PrevArrow (props) {
  const { className, onClick, firstPage } = props
  return (
    <PrevButton className={className} onClick={onClick} firstPage={firstPage} />
  )
}

const GetStarted = ({ step }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [firstPage, setFirstPage] = useState(true)
  const [lastPage, setLastPage] = useState(false)

  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <Dots />
        </a>
      )
    },
    focusOnSelect: false,
    dots: true,
    dotsClass: 'slick-dots slick-thumb',
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => {
      setCurrentSlide(next)
      if (current === 0 && firstPage) {
        setFirstPage(false)
      } else if (current === 4 && lastPage) {
        setLastPage(false)
      }
    },
    afterChange: current => {
      if (current === 0 && !firstPage) {
        setFirstPage(true)
      } else if (current === 4 && !lastPage) {
        setLastPage(true)
      }
    },
    nextArrow: <NextArrow lastPage={lastPage} />,
    prevArrow: <PrevArrow firstPage={firstPage} />
  }

  return (
    <Wrapper>
      <CarouselWrapper>
        <Slider {...settings}>
          <div>
            <CarouselPageWrapper>
              <Container>
                <Title size='24px' weight={600}>
                  <FormattedMessage
                    defaultMessage='Welcome to Swap!'
                    id='swap.carousel.title.page1'
                  />
                </Title>
                <BodyText weight={500}>
                  <FormattedMessage
                    defaultMessage='The easiest way to exchange one crypto for another without leaving your wallet.'
                    id='swap.carousel.desc.page1'
                  />
                </BodyText>
              </Container>
            </CarouselPageWrapper>
          </div>
          <div>
            <CarouselPageWrapper>
              <Container>
                <Title size='24px' weight={600}>
                  <FormattedMessage
                    defaultMessage='Real-time Exchange Rates'
                    id='swap.carousel.title.page2'
                  />
                </Title>
                <BodyText weight={500}>
                  <FormattedMessage
                    defaultMessage='Access competitive crypto prices right at your fingertips.'
                    id='swap.carousel.desc.page2'
                  />
                </BodyText>
              </Container>
            </CarouselPageWrapper>
          </div>
          <div>
            <CarouselPageWrapper>
              <Container>
                <Title size='24px' weight={600}>
                  <FormattedMessage
                    defaultMessage='100% On-Chain'
                    id='swap.carousel.title.page3'
                  />
                </Title>
                <BodyText weight={500}>
                  <FormattedMessage
                    defaultMessage='All Swap trades are confirmed and settled directly on-chain.'
                    id='swap.carousel.desc.page3'
                  />
                </BodyText>
              </Container>
            </CarouselPageWrapper>
          </div>
          <div>
            <CarouselPageWrapper>
              <Container>
                <Title size='24px' weight={600}>
                  <FormattedMessage
                    defaultMessage='You Control Your Key'
                    id='swap.carousel.title.page4'
                  />
                </Title>
                <BodyText weight={500}>
                  <FormattedMessage
                    defaultMessage='With Swap your crypto is safe, secure, and your keys are always intact.'
                    id='swap.carousel.desc.page4'
                  />
                </BodyText>
              </Container>
            </CarouselPageWrapper>
          </div>
          <div>
            <CarouselPageWrapper>
              <Container>
                <Title size='24px' weight={600}>
                  <FormattedMessage
                    defaultMessage='Manage Risk Better'
                    id='swap.carousel.title.page5'
                  />
                </Title>
                <BodyText weight={500}>
                  <FormattedMessage
                    defaultMessage='Introducing Digital Dollars (USD PAX) to de-risk your crypto investment or lock-in gains.'
                    id='swap.carousel.desc.page5-2'
                  />
                </BodyText>
              </Container>
            </CarouselPageWrapper>
          </div>
        </Slider>
        <PlacementDiv />
        <CarouselImage1 name='swap-carousel1' currentSlide={currentSlide} />
        <CarouselImage2 name='swap-carousel2' currentSlide={currentSlide} />
        <CarouselImage3 name='swap-carousel3' currentSlide={currentSlide} />
        <CarouselImage4 name='swap-carousel4' currentSlide={currentSlide} />
        <CarouselImage5 name='swap-carousel5' currentSlide={currentSlide} />
        <ButtonContainer>
          <StatusBar step={step} />
        </ButtonContainer>
      </CarouselWrapper>
    </Wrapper>
  )
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(GetStarted)
