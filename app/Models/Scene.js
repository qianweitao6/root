'use strict'

const Model = use('Model')

class Scene extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }

  devices () {
    return this.hasMany('App/Models/Device')
  }
}

module.exports = Scene
