import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
`
const Content = styled.div`
  position: relative;
  width: 100%;
  overflow-x: hidden;
  height: 100%;
`
const Slider = styled.div<{ index: number; total: number }>`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  top: 0;
  height: 100%;
  left: ${(props) => props.index * -100}%;
  width: ${(props) => (props.total + 1) * 100}%;
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
const Control = styled.div<{ active: boolean }>`
  display: flex;
  width: 10px;
  height: 10px;
  margin: 0 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.active ? props.theme.blue600 : props.theme.grey500)};
  cursor: pointer;
`
const Arrow = styled(Icon).attrs({
  name: 'arrow-down'
})<{ left?: boolean }>`
  transform: ${(props) => (props.left ? 'rotate(90deg)' : 'rotate(-90deg)')};
  cursor: pointer;
  z-index: 1;
  color: ${(props) => props.theme.grey400};
  font-size: 34px;

  &:hover {
    color: ${(props) => props.theme.grey600};
  }
`
const FooterWrapper = styled.div`
  display: flex;
  width: 100%;
`
const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 40px;
`

const ArrowWrapper = styled.div`
  width: 30px;
  height: 20px;
  display: flex;
`

const AnimatedCarousel = (props: Props) => {
  const { children, handleClick, handleNext, handlePrevious, index, total } = props

  return (
    <Wrapper>
      <Content>
        <Slider index={index} total={total}>
          {children}
        </Slider>
      </Content>
      <FooterWrapper>
        <Actions>
          <ArrowWrapper>{index > 0 && <Arrow left onClick={handlePrevious} />}</ArrowWrapper>
          <Controls>
            {[...Array(total + 1).keys()].map((value) => (
              <Control key={value} onClick={() => handleClick(value)} active={index === value} />
            ))}
          </Controls>
          <ArrowWrapper>{index < total && <Arrow onClick={handleNext} />}</ArrowWrapper>
        </Actions>
      </FooterWrapper>
    </Wrapper>
  )
}

type Props = {
  children: ReactNode
  handleClick: (index: number) => void
  handleNext: () => void
  handlePrevious: () => void
  index: number
  total: number
}

export default AnimatedCarousel
