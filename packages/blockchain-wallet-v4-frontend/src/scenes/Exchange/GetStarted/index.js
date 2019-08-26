import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import React, { useState } from 'react'
import Slider from 'react-slick'
import styled, { css } from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { getData } from './selectors'
import { Image, Text } from 'blockchain-info-components'
import StatusBar from './StatusBar'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 50px;
  box-sizing: border-box;

  @media (max-width: 37.5rem) {
    padding: 0;
  }
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
  top: 5rem;
  width: 19rem;
  transition: opacity 0.4s ease-in-out;
  background: ${({ theme }) => theme['white']};
  z-index: 2;

  @media (max-width: 61.25rem) {
    top: 0;
    right: 0;
    left: 0;
    margin: 0 auto;
  }

  @media (max-width: 25.625rem) {
    width: 17rem;
  }
`

const NextButton = styled.div`
  &.slick-next {
    height: 3rem;
    width: 3rem;
    border-bottom: 2px solid ${props => props.theme['brand-secondary']};
    border-right: 2px solid ${props => props.theme['brand-secondary']};
    transform: rotate(-45deg);
    right: -5rem;
    border-bottom-right-radius: 0.5rem;
    display: ${({ lastPage }) => (lastPage ? 'none' : 'block')};

    @media (max-width: 37.5rem) {
      display: none;
    }
  }
`

const PrevButton = styled.div`
  &.slick-prev {
    height: 3rem;
    width: 3rem;
    border-bottom: 2px solid ${props => props.theme['brand-secondary']};
    border-left: 2px solid ${props => props.theme['brand-secondary']};
    transform: rotate(45deg);
    left: -5rem;
    border-bottom-left-radius: 0.5rem;
    display: ${({ firstPage }) => (firstPage ? 'none' : 'block')};

    @media (max-width: 37.5rem) {
      display: none;
    }
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

    @media (max-width: 61.25rem) {
      width: 100%;
    }
  }

  .slick-slider > ul > li:first-child {
    margin-left: 0;
  }

  .slick-slider > ul > li > a > div {
    background: ${({ theme }) => theme['gray-2']};
    @media (max-width: 61.25rem) {
      background: ${({ theme }) => theme['l']};
    }
  }

  .slick-slider > ul > li.slick-active > a > div {
    background: ${({ theme }) => theme['brand-secondary']};
  }

  .slick-dots li button:before {
    width: 1.5rem;
    height: 0.25rem;
  }
`

const CarouselPageWrapper = styled(Row)`
  @media (max-width: 61.25rem) {
    justify-content: center;
  }
`

const Container = styled(Column)`
  width: 50%;
  height: 29.25rem;
  justify-content: center;

  @media (max-width: 69.375rem) {
    width: 45%;
  }

  @media (max-width: 65.5rem) {
    width: 40%;
  }

  @media (max-width: 61.25rem) {
    width: 100%;
    margin-top: 6rem;
    text-align: center;
  }
`

const Title = styled(Text)`
  margin-bottom: 10px;
  color: ${({ theme }) => theme['brand-primary']};
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
  height: 0.25rem;
  width: 1.5rem;
  border-radius: 14px;

  @media (max-width: 61.25rem) {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
  }
`

const PlacementDiv = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  background: ${({ theme }) => theme['white']};
  z-index: 1;

  @media (max-width: 69.375rem) {
    width: 55%;
  }

  @media (max-width: 65.5rem) {
    width: 60%;
  }

  @media (max-width: 61.25rem) {
    display: none;
  }
`

const ButtonContainer = styled(Row)`
  width: 100%;
  margin-top: -4.5rem;
  z-index: 1;
  margin-bottom: 4rem;
  @media (max-width: 61.25rem) {
    justify-content: center;
  }
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
                <Title size='1.5rem' weight={600}>
                  <FormattedMessage
                    defaultMessage='Welcome to Swap!'
                    id='swap.carousel.title.page1'
                  />
                </Title>
                <Text weight={500}>
                  <FormattedMessage
                    defaultMessage='The easiest way to exchange one crypto for another without leaving your wallet.'
                    id='swap.carousel.desc.page1'
                  />
                </Text>
              </Container>
            </CarouselPageWrapper>
          </div>
          <div>
            <CarouselPageWrapper>
              <Container>
                <Title size='1.5rem' weight={600}>
                  <FormattedMessage
                    defaultMessage='Real-time Exchange Rates'
                    id='swap.carousel.title.page2'
                  />
                </Title>
                <Text weight={500}>
                  <FormattedMessage
                    defaultMessage='Access competitive crypto prices right at your fingertips.'
                    id='swap.carousel.desc.page2'
                  />
                </Text>
              </Container>
            </CarouselPageWrapper>
          </div>
          <div>
            <CarouselPageWrapper>
              <Container>
                <Title size='1.5rem' weight={600}>
                  <FormattedMessage
                    defaultMessage='100% On-Chain'
                    id='swap.carousel.title.page3'
                  />
                </Title>
                <Text weight={500}>
                  <FormattedMessage
                    defaultMessage='All Swap trades are confirmed and settled directly on-chain.'
                    id='swap.carousel.desc.page3'
                  />
                </Text>
              </Container>
            </CarouselPageWrapper>
          </div>
          <div>
            <CarouselPageWrapper>
              <Container>
                <Title size='1.5rem' weight={600}>
                  <FormattedMessage
                    defaultMessage='You Control Your Key'
                    id='swap.carousel.title.page4'
                  />
                </Title>
                <Text weight={500}>
                  <FormattedMessage
                    defaultMessage='With Swap your crypto is safe, secure, and your keys are always intact.'
                    id='swap.carousel.desc.page4'
                  />
                </Text>
              </Container>
            </CarouselPageWrapper>
          </div>
          <div>
            <CarouselPageWrapper>
              <Container>
                <Title size='1.5rem' weight={600}>
                  <FormattedMessage
                    defaultMessage='Manage Risk Better'
                    id='swap.carousel.title.page5'
                  />
                </Title>
                <Text weight={500}>
                  <FormattedMessage
                    defaultMessage='Introducing Digital Dollars (USDp) to de-risk your crypto investment or lock-in gains.'
                    id='swap.carousel.desc.page5'
                  />
                </Text>
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
