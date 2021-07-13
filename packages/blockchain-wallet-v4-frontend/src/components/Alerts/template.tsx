import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import { Toast } from 'blockchain-info-components'
import { media } from 'services/styles'

import getAlertContent from './messages'

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 1050;

  ${media.tablet`
    bottom: 10px;
    right: 10px;
    width: 95%;
  `}
  ${media.atLeastTablet`
    top: 65px;
    right: 22px;
    width: auto;
  `}
`

const Alerts = (props) => {
  const { alerts, handleClose } = props

  return (
    <Wrapper>
      <AnimatePresence>
        {alerts.map((alert) => {
          const { coin, data, id, message, nature, persist, timeout } = alert
          const dismissTimer = timeout || 7000
          return (
            <motion.div
              key={id}
              transition={{ bounce: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Toast
                nature={nature}
                coin={coin}
                timeout={dismissTimer}
                persist={persist}
                onClose={() => handleClose(id)}
              >
                {getAlertContent(message, data)}
              </Toast>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </Wrapper>
  )
}

export default Alerts
