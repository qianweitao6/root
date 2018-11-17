'use strict'

const User = use('App/Models/User')
const { validate, validateAll } = use('Validator')
const Scene = use('App/Models/Scene')
const Device = use('App/Models/Device')

class UserController {
  async index () {
  }

  async create ({ view }) {
    return view.render('user.create')
  }

  async store ({ request, session, response }) {
    const rules = {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required|min:6|max:30'
    }
    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const newUser = request.only(['username', 'email', 'password'])
    const user = await User.create(newUser)
    return response.redirect(`/login`)
  }

  async show ({ params, view }) {
    const user = await User.findOrFail(params.id)
    await user.loadMany({
      scenes: builder => builder.select('id', 'scenename'),
      devices: builder => builder.select('id', 'devicename', 'detail', 'status')
    })
    return view.render('user.show', { user: user.toJSON() })
  }

  async scene ({ params, view, auth }) {
    const scene = await Scene.findOrFail(params.id)
    const user = await auth.getUser()
    await user.loadMany({
      scenes: builder => builder.select('id', 'scenename')
    })
    const _devices = await scene.devices().select('id', 'devicename', 'status').fetch()
    const devices = _devices.toJSON()
    for (let device of devices) {
      const _device = await Device.find(device.id)
      const _dtype = await _device.dtype().select('id', 'title').fetch()
      device.dtype = _dtype.toJSON()
    }
    return view.render('user.scene', { user: user.toJSON(), devices, scene })
  }

  async edit () {
  }

  async update () {
  }

  async destroy () {
  }
}

module.exports = UserController
