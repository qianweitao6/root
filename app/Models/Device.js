'use strict'

const Model = use('Model')

class Device extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }

  scene () {
    return this.belongsTo('App/Models/Scene')
  }

  dtype () {
    return this.belongsTo('App/Models/Dtype')
  }
}

module.exports = Device
