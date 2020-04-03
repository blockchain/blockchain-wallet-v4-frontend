import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`
const Content = styled.div`
  position: relative;
  width: 100%;
  min-height: ${props => props.height}px;
  overflow-x: hidden;
`
const Slider = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  top: 0;
  left: ${props => props.index * -100}%;
  width: ${props => (props.total + 1) * 100}%;
  min-height: auto;
  transition: all 0.4s ease-in-out;

  & > * {
    position: relative;
    width: 100%;
    height: 100%;
  }
`

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  & > :first-child {
    margin-right: 10px;
  }
`

const Carousel = props => {
  const {
    index,
    total,
    height,
    children,
    // handleClick,
    // handlePrevious,
    handleNext
  } = props

  return (
    <Wrapper>
      <Content height={height} total={total}>
        <Slider height={height} index={index} total={total}>
          {children}
        </Slider>
      </Content>
      <FooterWrapper>
        {index < total && (
          <Button width='60px' nature='light' onClick={handleNext}>
            <FormattedMessage
              id='components.emptyscenecarousel.next'
              defaultMessage='Next'
            />
          </Button>
        )}
        {index === total && (
          <Button width='70px' nature='light' onClick={handleNext}>
            <FormattedMessage
              id='components.emptyscenecarousel.goback'
              defaultMessage='Go Back'
            />
          </Button>
        )}
        <Text size='14px' weight={600} color='grey400'>
          {index + 1} of {total + 1}
        </Text>
      </FooterWrapper>
    </Wrapper>
  )
}

Carousel.propTypes = {
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  arrows: PropTypes.bool.isRequired,
  chips: PropTypes.bool.isRequired
}

export default Carousel
