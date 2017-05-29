import React from 'react'
import './style.scss'

import ActivityList from './ActivityList'
import BalanceSummary from './BalanceSummary'
import DidYouKnow from './DidYouKnow'

const Home = (props) => {
  return (
    <section className='home'>
      <div className='row'>
        <div className='col-md-6'>
          <ActivityList activities={props.activities} />
        </div>
        <div className='col-md-6'>
          <div className='row'>
            <BalanceSummary />
          </div>
          <div className='row'>
            <DidYouKnow />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
