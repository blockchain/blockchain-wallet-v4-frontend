const createSagas = require.requireActual('../sagas').default

const mockCreate = ({ create }) => ({
  create: ({ netwotk, payment }) => ({
    value: jest.fn(() => this),
    init: jest.fn(),
    to: jest.fn(),
    amount: jest.fn(),
    from: jest.fn(),
    fee: jest.fn(),
    build: jest.fn(),
    buildSweep: jest.fn(),
    sign: jest.fn(),
    publish: jest.fn(),
    description: jest.fn(),
    chain: jest.fn()
  })
})

export default ({ api }) => mockCreate(createSagas({ api }))
