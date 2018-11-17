'use strict'

const Device = use('App/Models/Device')
const Dtype = use('App/Models/Dtype')
const { validate, validateAll } = use('Validator')
const Scene = use('App/Models/Scene')

class DeviceController {
  async index () {
  }

  async create ({ auth, view, response, params }) {
    try {
      user = await auth.getUser()
    } catch (error) {
      return response.redirect(`/login`)
    }
    var user
    const pageCheck = params.pageCheck
    const _scenes = await user.scenes().select('id', 'scenename').fetch()
    const scenes = _scenes.toJSON()
    const sceneItems = scenes.map((scene) => {
      if (scene.id == pageCheck) {
        scene.selected = true
      }
      return scene
    })
    const dtypes = await Dtype.all()
    return view.render('device.create', { scenes: sceneItems, dtypes: dtypes.toJSON(), pageCheck })
  }

  async store ({ request, session, response, auth }) {
    const rules = {
      devicename: 'required',
      scene_id: 'required',
      detail: 'required'
    }
    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const newDevice = request.only(['devicename', 'scene_id', 'dtype_id', 'detail'])
    const user = await auth.getUser()
    newDevice.user_id = user.id
    const device = await Device.create(newDevice)
    if (request.input('selected', false)) {
      return response.route('UserController.scene', { id: device.scene_id })
    } else {
      return response.route('UserController.show', { id: user.id })
    }
  }

  async show ({ params, view }) {
    const _device = await Device.find(params.id)
    await _device.loadMany({
      dtype: builder => builder.select('id', 'title'),
      scene: builder => builder.select('id', 'scenename')
    })
    const device = _device.toJSON()
    if (device.dtype.id <= 4) {
      return view.render('device.showpcc', { device })
    } else {
      return view.render('device.showsdc', { device })
    }
  }

  async edit ({ params, view, auth }) {
    const _device = await Device.findOrFail(params.id)
    await _device.loadMany({
      dtype: builder => builder.select('id'),
      scene: builder => builder.select('id')
    })
    const device = _device.toJSON()
    const user = await auth.getUser()
    const _scenes = await user.scenes().select('id', 'scenename').fetch()
    const scenes = _scenes.toJSON()
    const _dtypes = await Dtype.all()
    const dtypes = _dtypes.toJSON()
    const sceneItems = scenes.map((scene) => {
      if (scene.id == device.scene.id) {
        scene.selected = true
      }
      return scene
    })
    const dtypeItems = dtypes.map((dtype) => {
      if (dtype.id == device.dtype.id) {
        dtype.selected = true
      }
      return dtype
    })
    return view.render('device.edit', { device, scenes: sceneItems, dtypes: dtypeItems })
  }

  async update ({ request, params, response }) {
    const { devicename, scene_id, dtype_id, detail } = request.all()
    const device = await Device.findOrFail(params.id)
    device.merge({ devicename, detail })
    await device.save()
    const scene = await Scene.find(scene_id)
    await device.scene().associate(scene)
    const dtype = await Dtype.find(dtype_id)
    await device.dtype().associate(dtype)
    return response.route('DeviceController.show', { id: params.id })
  }

  async statusUpdate ({ request, params, response }) {
    const { status } = request.all()
    const device = await Device.findOrFail(params.id)
    device.merge({ status })
    await device.save()
    response.send('success')
  }

  async destroy ({ params, response }) {
    const device = await Device.findOrFail(params.id)
    const scene = await device.scene().select('id').fetch()
    await device.delete()
    response.send(scene.toJSON())

  }
}

module.exports = DeviceController
