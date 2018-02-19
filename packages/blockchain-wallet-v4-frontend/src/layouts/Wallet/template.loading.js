import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import BalancesChartSkeleton from '../../scenes/Home/BalancesChart/template.loading'
import ActivityListSkeleton from '../../scenes/Home/ActivityList/template.loading'
import PriceIndexSeriesSkeleton from '../../scenes/Home/PriceIndexSeries/template.loading'
import { BlockchainLoader, Image, SkeletonRectangle } from 'blockchain-info-components'

import MenuTop from './MenuTop'
import { Navbar, NavbarBrand, NavbarHeader } from 'components/Navbar'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`
const Left = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  top: 60px;
  left: ${props => props.toggled ? '0' : '-270px'};
  width: 270px;
  height: 100%;
  padding: 25px;
  box-sizing: border-box;
  background: ${props => props.theme['white-blue']};
  border-right: 1px solid ${props => props.theme['gray-1']};
  z-index: 2;
  transition: left .3s ease-in-out;

  @media(min-width: 768px) {
    display: flex;
    flex: 0 0 270px;
    position: relative;
    top: initial;
    left: initial;
  }
`
const LeftItem = styled.div`
  display: flex;
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
  &:first-child {
    margin-top: 0px;
    > *:first-child {
      left: 5px;
      position: relative;
    }
    > *:last-child {
      margin-left: 20px;
    }
  }
`
const Content = styled.div`
  position: relative;
  display: flex;
  overflow: scroll;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100% - 270px);
  background-color: ${props => props.theme['white']};

  @media(max-width: 768px) { width: 100%; }
`
const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;

  @media(min-width: 992px) { flex-direction: row; }
`
const Column = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 30px 0;
  box-sizing: border-box;
`
const ColumnLeft = styled(Column)`
  padding: 30px;
  > div:last-child { margin-top: 15px; }
  @media(min-width: 992px) { padding: 30px 0px 30px 30px; }
`
const ColumnRight = styled(Column)`
  padding: 30px;
  > div:last-child { margin-top: 15px; }
  @media(min-width: 992px) { padding: 30px 30px 30px 15px; }
`
const Top = styled.div`
  width: 100%;
`

const WalletLayout = (props) => {
  return (
    <Wrapper>
      <Navbar height='60px'>
        <NavbarHeader>
          <NavbarBrand>
            <NavLink to='/'>
              <Image name='blockchain-vector' height='20px' />
            </NavLink>
          </NavbarBrand>
        </NavbarHeader>
      </Navbar>
      <Container>
        <Left>
          <LeftItem>
            <BlockchainLoader width='30px' height='30px' />
            <SkeletonRectangle width='calc(100% - 50px)' height='25px' bgColor='white' />
          </LeftItem>
          <LeftItem>
            <SkeletonRectangle width='100%' height='25px' bgColor='white' />
          </LeftItem>
          <LeftItem>
            <SkeletonRectangle width='100%' height='25px' bgColor='white' />
          </LeftItem>
          <LeftItem>
            <SkeletonRectangle width='100%' height='25px' bgColor='white' />
          </LeftItem>
        </Left>
        <Content>
          <Top>
            <MenuTop />
          </Top>
          <Page>
            <ColumnLeft>
              <BalancesChartSkeleton />
              <ActivityListSkeleton />
            </ColumnLeft>
            <ColumnRight>
              <PriceIndexSeriesSkeleton />
              <SkeletonRectangle width='100%' height='150px' bgColor='white-blue' />
            </ColumnRight>
          </Page>
        </Content>
      </Container>
    </Wrapper>
  )
}

WalletLayout.propTypes = {
  location: PropTypes.object.isRequired
}

export default WalletLayout
