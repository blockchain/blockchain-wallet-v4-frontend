import React from 'react'

import { SceneWrapper } from 'components/Layout'

import Cards from './Cards'
import Faq from './Faq'
import Header from './Header'
import HowItWorks from './HowItWorks'

const ActiveRewardsLearnContainer = () => (
  <SceneWrapper>
    <Header />
    <Cards />
    <HowItWorks />
    <Faq />
  </SceneWrapper>
)

export default ActiveRewardsLearnContainer
