'use strict'

const Schema = use('Schema')

class DeviceSchema extends Schema {
  up () {
    this.create('devices', (table) => {
      table.increments()
      table.string('devicename', 80).notNullable()
      table.text('detail', 'longtext').notNullable()
      table.string('status', 60).defaultTo('off')
      table.integer('user_id').unsigned().notNullable()
      table.integer('scene_id').unsigned().notNullable()
      table.integer('dtype_id').unsigned().notNullable()
      table.foreign('user_id').references('users.id')
      table.foreign('scene_id').references('scenes.id')
      table.foreign('dtype_id').references('dtypes.id')
      table.timestamps()
    })
  }

  down () {
    this.drop('devices')
  }
}

module.exports = DeviceSchema
