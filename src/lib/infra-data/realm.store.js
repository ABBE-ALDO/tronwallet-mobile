class RealmStore {
  constructor (db, schema) {
    this._db = db
    this.schema = schema
  }

  findByKey (key) {
    return this._db.objectForPrimaryKey(this.schema, key)
  }

  findAll () {
    return this._db.objects(this.schema)
  }

  findBy (filter) {
    return this._db.objects(this.schema).filtered(filter)
  }

  sort (sortCriteria) {
    return this._db.objects(this.schema).sorted(sortCriteria)
  }

  async write (callbackFn) {
    await this._db.write(callbackFn)
  }

  async save (object) {
    await this.write(() => {
      this._db.create(this.schema, object, true)
    })
  }

  async deleteByKey (key) {
    const object = this.findByKey(key)
    if (object) {
      await this.delete(object)
    }
  }

  async delete (object) {
    await this.write(() => {
      this._db.delete(this.schema, object)
    })
  }

  async resetData () {
    const allObjects = this.findAll()
    await this.delete(allObjects)
  }

  get db () {
    return this._db
  }
}

export default RealmStore
