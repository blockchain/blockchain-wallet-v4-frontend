import Enzyme from '../../node_modules/enzyme/build/index'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

// mock support for fetch and sockets
global.fetch = require('jest-fetch-mock')
global.WebSocket = require('mock-socket').WebSocket
