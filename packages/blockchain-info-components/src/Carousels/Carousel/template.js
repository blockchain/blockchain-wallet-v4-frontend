import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { range } from 'ramda'
import styled from 'styled-components'

import { Button } from '../../Buttons'
import { Color } from '../../Colors/index.ts'
import { Icon } from '../../Icons'
import { Text } from '../../Text'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
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
const Controls = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
`
const Control = styled.div`
  display: flex;
  width: 10px;
  height: 10px;
  margin: 0 10px;
  border-radius: 5px;
  background-color: ${props =>
    props.active ? props.theme.blue600 : props.theme['grey500']};
  cursor: pointer;
  z-index: ;
`
const Arrow = styled(Icon).attrs({
  name: 'chevron-down',
  size: '34px',
  weight: 700,
  color: 'grey800'
})`
  position: absolute;
  top: 50%;
  margin-top: -18px;
  left: ${props => (props.left ? '10px' : 'initial')};
  right: ${props => (!props.left ? '10px' : 'initial')};
  transform: ${props => (props.left ? 'rotate(90deg)' : 'rotate(-90deg)')};
  cursor: pointer;
  z-index: 1;

  &:hover {
    color: ${Color('blue600')}!important;
  }
`
const FooterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  & > :first-child {
    margin-right: 10px;
  }
`

const Carousel = props => {
  const {
    arrows,
    children,
    chips,
    handleClick,
    handleNext,
    handlePrevious,
    height,
    index,
    nextButton,
    total
  } = props

  return (
    <Wrapper>
      <Content height={height} total={total}>
        {arrows && <Arrow left onClick={handlePrevious} />}
        <Slider height={height} index={index} total={total}>
          {children}
        </Slider>
        {arrows && <Arrow onClick={handleNext} />}
      </Content>
      {chips && (
        <Controls>
          {range(0, total + 1).map((value, arrayIndex) => (
            <Control
              key={arrayIndex}
              onClick={() => handleClick(value)}
              active={index === value}
            />
          ))}
        </Controls>
      )}
      {nextButton && (
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
              <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
            </Button>
          )}
          <Text size='14px' weight={600} color='grey400'>
            {index + 1} of {total + 1}
          </Text>
        </FooterWrapper>
      )}
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
