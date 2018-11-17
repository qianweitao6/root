'use strict'

/*
|--------------------------------------------------------------------------
| DtypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const Dtype = use('App/Models/Dtype')

class DtypeSeeder {
  async run () {
    const dtypes = [
      { title: '智能灯' },
      { title: '智能插排' },
      { title: '智能开关' },
      { title: '智能窗帘' },
      { title: '温度' },
      { title: '湿度' },
      { title: '粉尘烟雾' },
      { title: '一氧化碳' }
    ]

    await Dtype.createMany(dtypes)
  }
}

module.exports = DtypeSeeder
