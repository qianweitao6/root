$(function () {
  const sensorData = $('#sensorData')
  const user_id = sensorData.data('user_id')
  const device_id = sensorData.data('device_id')
  const dtype_title = sensorData.data('dtype_title')
  const topic = 'users/' + user_id + '/devices/' + device_id
  const connectAlert = $('#connectAlert')
  var client = mqtt.connect('ws://192.168.33.10:3000');

  var myChart = echarts.init(document.getElementById('main'))
  var newDate = new Date()
  const startDate = newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getDate() + ' 00:00:00'
  const endDate = newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + (newDate.getDate() + 1) + ' 00:00:00'
  var data = []
  var anchor = []
  anchor.push([startDate, 0], [endDate, 0])
  var option = {
    title: {
        text: dtype_title,
        subtext: '实时数据'
    },
    xAxis: {
      type: 'time',  //时间轴
      splitLine: {
        show: false //不显示坐标轴在区域的分隔线
      }
    },
    yAxis: {
      type: 'value',  //数值轴
      boundaryGap: [0, '50%'], //坐标轴最小值和最大值根据实际数据而定，100%就是最大值的一倍
      scale: true, //不强制包含零刻度
      splitLine: {
        show: false //不显示坐标轴在区域的分隔线
      },
      axisLine: {
        symbol: ['none', 'arrow'] //显示坐标轴末端箭头
      }
    },
    tooltip: {
      trigger: 'axis' //坐标轴触发
    },
    toolbox: {
      left: 'center',
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,  //控制第一个坐标轴
        start: 0,
        end: 100
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        start: 0,
        end: 100
      }
    ],
    series: [{
      name: dtype_title,
      type: 'line',
      showSymbol: false,  //不显示数据点的标记图形
      data: data
    },
    {
      name: '.anchor',
      type: 'line',
      showSymbol: false,
      data: anchor,
      lineStyle: {
        opacity: 0  //线条透明度为0，即不显示该线条
      }
    }
    ]
  };
  myChart.setOption(option);

  client.subscribe(topic)
  client.on("message", function (topic, payload) {
    const nowDate = new Date()
    const nowDateString = nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate() + ' ' + nowDate.getHours() + ':' + nowDate.getMinutes() + ':' + nowDate.getSeconds()
    const _payload = payload.toString()
    const payloadJSON = $.parseJSON(_payload)
    data.push([nowDateString, payloadJSON[dtype_title]])
    myChart.setOption(option)
  })

  const deleteButton = $('#delete')

  deleteButton.on('click', function () {
    const id = deleteButton.data('id')
    const _csrf = deleteButton.data('csrf')
    $.ajax({
      url: `/devices/${ id }`,
      method: 'DELETE',
      data: {
        _csrf
      },
      success: (response) => {
        if (response.id) {
          window.location.href = '/users/scenes/' + response.id
        }
      }
    })
  })


})
