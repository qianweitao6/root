'use strict'

const Schema = use('Schema')

class DtypeSchema extends Schema {
  up () {
    this.create('dtypes', (table) => {
      table.increments()
      table.string('title', 80).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('dtypes')
  }
}

module.exports = DtypeSchema
