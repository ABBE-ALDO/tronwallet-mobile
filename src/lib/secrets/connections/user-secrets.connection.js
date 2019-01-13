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
}

const openRealmConnection = () => Realm.open({
  path: `realm.userSecrets`,
  schema: [UserSecret],
  schemaVersion: 2,
  encryptionKey: getEncryptionKey(),
  migration
})

let _instance = null

export default async () => {
  if (!_instance) {
    const connection = await openRealmConnection()
    _instance = new RealmStore(connection, 'UserSecret')
  }

  return _instance
}
