import NabuError from '../../NabuError'

const isNabuError = (error: Error | NabuError): error is NabuError => error instanceof NabuError

export default isNabuError
