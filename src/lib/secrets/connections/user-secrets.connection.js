import Realm from 'realm'
import { UserSecret } from '../models'
import { getEncryptionKey } from '../../security/crypto'
import RealmStore from '../../infra-data/realm.store'

const migration = (oldRealm, newRealm) => {
  const newObjects = newRealm.objects('UserSecret')
  if (!newObjects.length) {
    return
  }

  if (oldRealm.schemaVersion < 1) {
    newObjects[0].name = 'Main Account'
    newObjects[0].alias = '@main_account'
  }

  if (oldRealm.schemaVersion < 2) {
    newObjects.forEach(object => {
      object.hide = false
    })
  }

  if (oldRealm.schemaVersion < 3) {
    newObjects.forEach((object, index) => {
      object.order = index
      object.type = 'TRX'
      object.coin = 'TRONIX'
      object.meta = null
    })
  }
}

const openRealmConnection = async () => {
  const encryptionKey = await getEncryptionKey()
  return Realm.open({
    path: `realm.userSecrets`,
    schema: [UserSecret],
    schemaVersion: 3,
    encryptionKey,
    migration
  })
}

let _instance = null

export default async () => {
  if (!_instance) {
    const connection = await openRealmConnection()
    _instance = new RealmStore(connection, 'UserSecret')
  }

  return _instance
}
