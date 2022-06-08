import NabuError from '../../NabuError'

const isNabuError = (error: unknown | NabuError): error is NabuError => error instanceof NabuError

export default isNabuError
