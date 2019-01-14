import { AsyncStorage } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import sha256 from 'crypto-js/sha256'
import pbkdf2 from 'crypto-js/pbkdf2'
import hex from 'crypto-js/enc-hex'
import base64 from 'base-64'
import base64js from 'base64-js'

export const savePin = async (pin) => {
  if (!pin) {
    return
  }

  const pinHash = hex.stringify(sha256(pin))
  await AsyncStorage.setItem('PIN', pinHash)
}

export const validatePin = async (pin) => {
  const pinHash = await AsyncStorage.getItem('PIN')

  if (!pinHash) {
    throw new Error('Pin isn\'t loaded')
  }

  return hex.stringify(sha256(pin)) === pinHash
}

export const getEncryptionKey = async () => {
  const pinHash = await AsyncStorage.getItem('PIN')

  if (!pinHash) {
    throw new Error('Pin isn\'t loaded')
  }

  const idHex = hex.stringify(sha256(DeviceInfo.getDeviceId()))

  const key = pbkdf2(pinHash, idHex, { keySize: 512 / 64 })
  const keyEnc64 = base64.encode(key.toString())

  return base64js.toByteArray(keyEnc64)
}

export const clear = () =>
  AsyncStorage.setItem('PIN', null)
