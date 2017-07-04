import React from 'react'

import ActivityList from './ActivityList'
import BalanceSummary from './BalanceSummary'
import DidYouKnow from './DidYouKnow'

const Home = (props) => {
  return (
    <section className='container-fluid'>
      <div className='row padding-top-20'>
        <div className='col-12 col-lg-6'>
          <ActivityList />
        </div>
        <div className='col-12 col-lg-6'>
          <BalanceSummary />
          <DidYouKnow />
        </div>
      </div>
    </section>
  )
}

export default Home
