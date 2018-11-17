var echarts = require('echarts');

var myChart = echarts.init(document.getElementById('main'));

myChart.setOption({
    title: {
        text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
});

$(function () {
  $('#button-control').on('click', function () {
    if ($('#status-control').text() == '关闭') {
      $('#status-control').removeClass('badge-secondary').addClass('badge-primary').text('开启');
      $('#button-control').removeClass('btn-outline-primary').addClass('btn-outline-secondary').text('关闭');
    } else {
      $('#status-control').removeClass('badge-primary').addClass('badge-secondary').text('关闭');
      $('#button-control').removeClass('btn-outline-secondary').addClass('btn-outline-primary').text('开启');
    }
  });
})
