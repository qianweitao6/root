'use strict'

const Model = use('Model')

class Dtype extends Model {
  devices () {
    return this.hasMany('App/Models/Device')
  }
}

module.exports = Dtype
