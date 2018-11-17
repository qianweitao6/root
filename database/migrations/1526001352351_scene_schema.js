'use strict'

const Schema = use('Schema')

class SceneSchema extends Schema {
  up () {
    this.create('scenes', (table) => {
      table.increments()
      table.string('scenename', 80).notNullable()
      table.text('detail', 'longtext').notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('users.id')
      table.timestamps()
    })
  }

  down () {
    this.drop('scenes')
  }
}

module.exports = SceneSchema
