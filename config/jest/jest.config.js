import Enzyme from '../../node_modules/enzyme/build/index'
/**
 * fixes new react context api
 * @see https://github.com/airbnb/enzyme/issues/1509
 * @todo update when enzyme adapter new version is published
 */
import Adapter from './React16-3Adapter'

Enzyme.configure({ adapter: new Adapter() })

// mock support for fetch and sockets
global.fetch = require('jest-fetch-mock')
global.WebSocket = require('mock-socket').WebSocket
