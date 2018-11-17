'use strict'

const Scene = use('App/Models/Scene')
const { validate, validateAll } = use('Validator')
const Device = use('App/Models/Device')

class SceneController {
  async index () {
  }

  async create ({ auth, view, response, params }) {
    try {
      await auth.check()
    } catch (error) {
      return response.redirect(`/login`)
    }
    const pageCheck = params.pageCheck
    return view.render('scene.create', { pageCheck })
  }

  async store ({ request, session, response, auth }) {
    const rules = {
      scenename: 'required',
      detail: 'required'
    }
    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const newScene = request.only(['scenename', 'detail'])
    const user = await auth.getUser()
    newScene.user_id = user.id
    const scene = await Scene.create(newScene)
    return response.route('UserController.scene', { id: scene.id })
  }

  async show ({ params, view }) {

    return view.render('scene.show')
  }

  async edit ({ view, params }) {
    const _scene = await Scene.findOrFail(params.id)
    const scene = _scene.toJSON()
    return view.render('scene.edit', { scene })
  }

  async update ({ request, params, response }) {
    const scene = await Scene.findOrFail(params.id)
    const { scenename, detail } = request.all()
    scene.merge({ scenename, detail })
    await scene.save()
    return response.route('UserController.scene', { id: scene.id })
  }

  async destroy ({ request, params, response, auth }) {
    const _user = await auth.getUser()
    const scene = await Scene.findOrFail(params.id)
    const _devices = await scene.devices().select('id').fetch()
    const devices = _devices.toJSON()
    for (let k in devices) {
      const device = await Device.findOrFail(devices[k].id)
      await device.delete()
    }
    await scene.delete()
    const user = _user.toJSON()
    user.success = true
    response.send(user)
  }
}

module.exports = SceneController
