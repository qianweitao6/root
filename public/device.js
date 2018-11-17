$(function () {
  const dcValue = $('#deviceControlValue')
  const user_id = dcValue.data('user')
  const device_id = dcValue.data('device')
  const topic = 'users/' + user_id + '/devices/' + device_id
  const connectAlert = $('#connectAlert')
  var client = mqtt.connect('ws://192.168.33.10:3000')

  var myChart = echarts.init(document.getElementById('main'));
  var newDate = new Date()
  const startDate = newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getDate() + ' 00:00:00'
  const endDate = newDate.getFullYear() + '/' + (newDate.getMonth() + 1) + '/' + (newDate.getDate() + 1) + ' 00:00:00'
  var data = [
    ['2018/5/20 6:12:23', 0],
    ['2018/5/20 6:12:24', 1],
    ['2018/5/20 7:02:30', 1],
    ['2018/5/20 7:02:31', 0],
    ['2018/5/20 11:21:11', 0],
    ['2018/5/20 11:21:12', 1],
    ['2018/5/20 12:30:51', 1],
    ['2018/5/20 12:30:52', 0],
    ['2018/5/20 14:12:33', 0],
    ['2018/5/20 14:12:34', 1],
    ['2018/5/20 15:30:52', 1],
    ['2018/5/20 15:30:53', 0],
    ['2018/5/20 18:12:11', 0],
    ['2018/5/20 18:12:12', 1],
    ['2018/5/20 22:37:23', 1],
    ['2018/5/20 22:37:24', 0]
  ];
  var anchor = []
  anchor.push([startDate, 0], [endDate, 0])
  var option = {
    title: {
        text: '电量使用情况'
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
      splitLine: {
        show: false //不显示坐标轴在区域的分隔线
      },
      axisLine: {
        symbol: ['none', 'arrow'] //显示坐标轴末端箭头
      },
      axisTick: {
        show: false //不显示坐标轴刻度
      },
      axisLabel: {
        show: false //不显示坐标轴标签
      }
    },
    tooltip: {
      trigger: 'axis' //坐标轴触发
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,  //控制第一个坐标轴
        start: 100,
        end: 0
      }
    ],
    series: [{
      name: '模拟数据',
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

  const deleteButton = $('#delete')
  const controlButton = $('#button-control')

  var btn_on = function () {
    $('#status-control').removeClass('badge-secondary').addClass('badge-primary').text('开启');
    $('#button-control').removeClass('btn-outline-primary disabled').addClass('btn-outline-secondary').text('关闭');
  }
  var btn_off = function () {
    $('#status-control').removeClass('badge-primary').addClass('badge-secondary').text('关闭');
    $('#button-control').removeClass('btn-outline-secondary disabled').addClass('btn-outline-primary').text('开启');
  }

  controlButton.on('click', function () {
    if ($('#status-control').text() == '关闭') {
      const status = 'on';
      client.publish(topic, '{ "status": "on" }');
      putAjax(status);
      $('#button-control').addClass('disabled').text('开启中');
      setTimeout(btn_on, 1000);
    } else {
      const status = 'off';
      client.publish(topic, '{ "status": "off" }');
      putAjax(status);
      $('#button-control').addClass('disabled').text('关闭中');
      setTimeout(btn_off, 1000);
    }
  })
  var handle = $( "#custom-handle" );
  $( "#slider" ).slider({
    range: "min",
    value: 1,
    min: 1,
    max: 300,
    create: function() {
      handle.text( $( this ).slider( "value" ) );
    },
    slide: function( event, ui ) {
      handle.text( ui.value );
    },
    stop: function( event, ui ) {
      $( "#amount" ).val( ui.value );
      console.log('{ "value": '+ ui.value +' }')
      client.publish(topic, '{ "value": '+ ui.value +' }')
    }
  });
  $( "#amount" ).val( $( "#slider" ).slider( "value" ) );

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

  var putAjax = function (status) {
    const id = controlButton.data('id')
    const _csrf = controlButton.data('csrf')
    $.ajax({
      url: `/devices/statusUpdate/${ id }`,
      method: 'PUT',
      data: {
        _csrf,
        status
      },
      success: (response) => {
        //
      }
    })
  }

})
