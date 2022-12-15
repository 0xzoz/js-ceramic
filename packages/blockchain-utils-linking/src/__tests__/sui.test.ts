import { jest } from '@jest/globals'
import { SuiAuthProvider } from '../sui.js'
import { Ed25519Keypair } from "@mysten/sui.js";
import { sign } from '@stablelib/ed25519'
import * as uint8arrays from 'uint8arrays'

const did = 'did:3:bafysdfwefwe'
const privKey =
  'mdqVWeFekT7pqy5T49+tV12jO0m+ESW7ki4zSU9JiCgbL0kJbj5dvQ/PqcDAzZLZqzshVEs01d1KZdmLh4uZIg=='
const chainRef = 'mainnet'

class MyWalletAdapter  {
  readonly _keyPair: Ed25519Keypair

  constructor(keyPair: Ed25519Keypair) {
    this._keyPair = keyPair
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    return sign(this._keyPair.secretKey, message)
  }
}

let keyPairEd25519: Ed25519Keypair

beforeAll(() => {
  keyPairEd25519 = Ed25519Keypair.fromSecretKey(uint8arrays.fromString(privKey, 'base64'))
  global.Date.now = jest.fn().mockImplementation(() => 666000)
})

afterAll(() => {
  jest.clearAllMocks()
})

describe('Blockchain: Sui', () => {
  describe('createLink', () => {
    test(`create proof for ${chainRef}`, async () => {
      const provider = new MyWalletAdapter(keyPairEd25519)
      const authProvider = new SuiAuthProvider(
        provider,
        keyPairEd25519.publicKey.toString(),
        chainRef
      )
      const proof = await authProvider.createLink(did)
      expect(proof).toMatchSnapshot()
    })
  })

  describe('authenticate', () => {
    test(`create proof for ${chainRef}`, async () => {
      const provider = new MyWalletAdapter(keyPairEd25519)
      const authProvider = new SuiAuthProvider(
        provider,
        keyPairEd25519.publicKey.toString(),
        chainRef
      )
      const result = await authProvider.authenticate('msg')
      expect(result).toMatchSnapshot()
    })
  })
})
