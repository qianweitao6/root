'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.on('/').render('auth.login')
// Route.get('/', 'AuthController.login')

Route.get('login', 'AuthController.login').as('login')

Route.get('register', 'UserController.create')

Route.post('users', 'UserController.store')

Route.post('auth', 'AuthController.auth').as('auth')

Route.get('users/:id', 'UserController.show')

Route.post('logout', 'AuthController.logout').as('logout')

Route.get('scenes/create/:pageCheck?', 'SceneController.create')

Route.post('scenes', 'SceneController.store')

Route.get('devices/create/:pageCheck?', 'DeviceController.create')

Route.post('devices', 'DeviceController.store')

Route.get('scenes/show', 'SceneController.show')

Route.get('users/scenes/:id', 'UserController.scene')

Route.get('devices/:id', 'DeviceController.show')

Route.get('scenes/:id/edit', 'SceneController.edit')

Route.put('scenes/:id', 'SceneController.update')

Route.delete('scenes/:id', 'SceneController.destroy')

Route.delete('devices/:id', 'DeviceController.destroy')

Route.get('devices/:id/edit', 'DeviceController.edit')

Route.put('devices/:id', 'DeviceController.update')

Route.put('devices/statusUpdate/:id', 'DeviceController.statusUpdate')
