'use strict'

const { validate, validateAll } = use('Validator')

class AuthController {
  async login ({ view }) {
    return view.render('auth.login')
  }

  async auth ({ request, session, response, auth }) {
    const rules = {
      username: 'required',
      password: 'required|min:6|max:30'
    }
    const validation = await validateAll(request.all(), rules)
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }
    const { username, password } = request.all()
    try {
      await auth.attempt(username, password)
    } catch (error) {
      return response.redirect('back')
    }
    const user = await auth.getUser()
    return response.route('UserController.show', { id: user.id })
  }

  async logout ({ auth, response }) {
    await auth.logout()
    return response.redirect(`/login`)
  }

}

module.exports = AuthController
