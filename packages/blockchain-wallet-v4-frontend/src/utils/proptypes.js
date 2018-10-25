import PropTypes from 'prop-types'
import { Remote } from 'blockchain-wallet-v4/src'

export const getRemotePropType = dataPropType =>
  PropTypes.oneOfType([
    PropTypes.oneOf([Remote.Loading, Remote.NotAsked]),
    PropTypes.instanceOf(Remote.Failure),
    PropTypes.shape({
      data: dataPropType
    })
  ])

export const getElementsPropType = valuePropType =>
  PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string,
          value: valuePropType
        })
      )
    })
  )
