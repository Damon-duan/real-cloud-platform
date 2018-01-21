<template>
  <div class="container-fluid">
    <div class="col-md-2 list-wrapper">
      <div class="col-md-12 sensor-list-wrapper">
        <sensor-list></sensor-list>
      </div>
    </div>
    <div class="col-md-10" id="container">
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active">
          <a href="#home" aria-controls="home" role="tab" data-toggle="tab">当前</a>
        </li>
        <li role="presentation">
          <a href="#profile" id="profile-tab" role="tab" data-toggle="tab">统计</a>
        </li>
      </ul>
      <div class="tab-content">
        <div role="tabpanel" class="tab-pane active" id="home">
          <div class="detail-info clearfix">
            <base-info></base-info>
            <div class="row">
              <div class="wrapper wrapper-content animated fadeIn">
                <div class="ibox">
                  <div class="ibox-content">
                    <div class="row">
                      <div class="data-wrapper col-md-12">
                        <div id="chart" style="height: 400px;"></div>
                        <div class="col-md-12" style="margin-top: 10px;margin-bottom: 10px;">
                          <div data-toggle="buttons" class="btn-group date-type-btn-group">
                            <label class="btn btn-sm btn-primary active" @click="setDateType('today')">
                              <input type="radio" id="option1" name="options"> 今天 </label>
                            <label class="btn btn-sm btn-white" @click="setDateType('yesterday')">
                              <input type="radio" id="option2" name="options"> 昨天 </label>
                            <label class="btn btn-sm btn-white" @click="setDateType('latestWeek')">
                              <input type="radio" id="option3" name="options"> 最近一周 </label>
                            <label class="btn btn-sm btn-white" @click="setDateType('latestMonth')">
                              <input type="radio" id="option4" name="options"> 最近一个月 </label>
                          </div>
                        </div>
                        <div id="dataTable" class="col-md-12">
                          <table class="table table-bordered">
                            <thead>
                            <tr>
                              <th style="width: 300px;">时间</th>
                              <th>{{getSensorName(sensor)}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="data in hisData">
                              <td>{{data[0]}}</td>
                              <td>{{data[1]}}</td>
                            </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div role="tabpanel" class="tab-pane" id="profile">

          <div class="row" style="margin: 10px;">
            <div class="col-md-6 pull-left">
              <div class="form-group datepicker-container">
                <label class="col-lg-2 control-label">时间范围</label>

                <div class="col-lg-8">
                  <div class="input-daterange input-group" id="datepicker">
                    <input type="text" class="input-sm form-control startTime" name="start" />
                    <span class="input-group-addon">到</span>
                    <input type="text" class="input-sm form-control endTime" name="end" />
                  </div>
                </div>
                <div class="col-lg-1">
                  <button class="btn btn-sm btn-success" type="button" @click="statistics()">查询</button>
                </div>
                <div class="col-lg-1">
                  <button class="btn btn-sm btn-success" type="button" @click="download()">下载</button>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <!--<div class="panel panel-default">-->
              <!--<div class="panel-heading">-->
              <!--<span class="sensor-text" style="margin: 0 10px;"></span>-->
              <!--<span class="time-text" style="margin: 0 10px;"></span>-->
              <!--每分钟平均-->
              <!--</div>-->
              <!--<div class="panel-body">-->
              <!--<div id="chart-minute" style="height: 300px"></div>-->
              <!--</div>-->
              <!--</div>-->

              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">
                    <span class="sensor-text" style="margin: 0 10px;"></span>
                    <span class="time-text" style="margin: 0 10px;"></span>
                    每小时平均
                  </h3>
                </div>
                <div class="panel-body">
                  <div id="chart-hour" style="height: 300px"></div>
                </div>
              </div>

              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">
                    <span class="sensor-text" style="margin: 0 10px;"></span>
                    <span class="time-text" style="margin: 0 10px;"></span>
                    当日平均,当日最大值,当日最小值
                  </h3>
                </div>
                <div class="panel-body">
                  <div id="chart-day" style="height: 300px"></div>
                </div>
              </div>

              <div class="panel panel-default">
                <div class="panel-heading">
                  <h3 class="panel-title">
                    <span class="sensor-text" style="margin: 0 10px;"></span>
                    <span class="time-text" style="margin: 0 10px;"></span>
                    当月平均
                  </h3>
                </div>
                <div class="panel-body">
                  <div id="chart-month" style="height: 300px"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import sensorList from './SensorList'
  import baseInfo from './BaseInfo'
  import asenConfig from '@/assets/js/asenConfig'
  import dateUtil from '@/assets/js/DateUtil'

  let chart = null
  let $daterange
  function setChartOption (name, option) {
    let sensorName = asenConfig.getSensorName(name)
    let defaultOption = {
      title: {
        left: 'center',
        subtext: sensorName + '实时图'
      },
      grid: {
        bottom: 80
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        data: [],
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: false }
      },
      legend: {
        data: [sensorName],
        x: 'left',
        show: true
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        }
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
      dataZoom: [{}, {
        type: 'inside'
      }],
      series: {
        name: '',
        type: 'line',
        data: [],
        lineStyle: {
          normal: {
            width: 2
          }
        }
      }
    }

    if (asenConfig.getUnit(name)) {
      defaultOption.yAxis['name'] = sensorName + '(' + asenConfig.getUnit(name) + ')'
      defaultOption.tooltip['formatter'] = '{b}<br/>{a}: {c} (' + asenConfig.getUnit(name) + ')'
    }
    if (asenConfig.sensorChartType(name) === 'area') {
      defaultOption.series['areaStyle'] = { normal: {} }
    }

    if (asenConfig.getStandard(name)) {
      defaultOption.series['markLine'] = {
        data: [
          {
            label: {
              normal: {
                formatter: '标准值 ' + asenConfig.getStandard(name)
              }
            },
            yAxis: asenConfig.getStandard(name)
          }
        ]
      }
      defaultOption['visualMap'] = {
        top: 10,
        right: 10,
        pieces: [{
          gt: 0,
          lte: asenConfig.getStandard(name),
          color: '#99CC99'
        }, {
          gt: asenConfig.getStandard(name),
          color: '#FF6666'
        }],
        outOfRange: {
          color: '#999'
        }
      }
    }
    // 绘制图表
    let newOption = {}
    $.extend(true, newOption, defaultOption, option)
    chart.setOption(newOption)
  }

  export default {
    name: 'hello',
    data () {
      return {
        hisData: [],
        sensor: '',
        dateType: 'today',
        device_id: asenConfig.device_id
      }
    },
    components: {
      'sensor-list': sensorList,
      'base-info': baseInfo
    },
    watch: {
      'dateType': function () {
        this.getHistoryData()
      }
    },
    methods: {
      download: function () {
        let startDate = $('.input-daterange .startTime').datepicker('getDates')[0]
        let endDate = $('.input-daterange .endTime').datepicker('getDates')[0]

        if (!this.device_id) {
          toastr.error('没有选择设备')
          return
        }

        if (!this.sensor) {
          toastr.error('没有选择传感器')
          return
        }

        if (!startDate || !endDate) {
          toastr.error('没有选择开始结束时间')
          return
        }

        let params = {
          device_id: this.device_id,
          sensor: this.sensor,
          sensorName: asenConfig.getSensorName(
            this.sensor
          ),
          startDate: dateUtil.format(new Date(startDate), 'yyyy-MM-dd 00:00:00'),
          endDate: dateUtil.format(new Date(endDate), 'yyyy-MM-dd 23:59:59')
        }
        let url = '/analysis/export'
        // loading.start();
        $.fileDownload(url, {
          httpMethod: 'POST',
          data: params
        }).done(() => {
          // loading.stop()
        }).fail(() => {
          toastr.error('下载失败')
          // loading.stop()
        })
      },
      statistics: function () {
        let _this = this
        let startDate = $('.input-daterange .startTime').datepicker('getDates')[0]
        let endDate = $('.input-daterange .endTime').datepicker('getDates')[0]

        if (!startDate || !endDate) {
          toastr.error('没有选择开始结束时间')
          return
        }

        // loading.start();

        this.$http.get('/statistics/' + this.device_id + '?startTime=' + dateUtil.format(new Date(startDate), 'yyyy-MM-dd 00:00:00') + '&endTime=' + dateUtil.format(new Date(endDate), 'yyyy-MM-dd 23:59:59') + '&sensor=' + this.sensor
        ).then(() => {
          // loading.stop()
        }).then(result => {
          if (!result) {
            toastr.error('查询时间没有取到数据')
          }

          $('.sensor-text').text(asenConfig.getSensorName(this.sensor))
          $('.time-text').text('在' + dateUtil.format(new Date(startDate), 'yyyy-MM-dd 00:00:00') + ' 到 ' + dateUtil.format(new Date(endDate), 'yyyy-MM-dd 00:00:00'))

          let hourAvg = echarts.init(document.getElementById('chart-hour'))
          _this.setStatistics(hourAvg, 'line', '每小时平均值', result.data.hourAvg)

          let dayAvg = echarts.init(document.getElementById('chart-day'))
          _this.setStatistics(dayAvg, 'line', '当日平均值', result.data.dayAvg,
            'line', '当日最大值', result.data.day_max,
            'line', '当日最小值', result.data.day_min)

          let monthAvg = echarts.init(document.getElementById('chart-month'))
          _this.setStatistics(monthAvg, 'line', '当月平均值', result.data.monthAvg)
        })
      },
      setStatistics (chart, type1, title1, data1, type2, title2, data2, type3, title3, data3) {
        if (!type1) {
          type1 = 'line'
        }
        let legendData = [title1]
        if (title2) {
          legendData.push(title2)
        }

        if (title3) {
          legendData.push(title3)
        }

        let series = [
          {
            name: asenConfig.getSensorName(this.sensor) + title1,
            type: type1,
            data: data1.map(function (item) {
              return item.data
            })
          }
        ]

        if (type2) {
          series.push({
            name: asenConfig.getSensorName(this.sensor) + title2,
            type: type2,
            data: data2.map(function (item) {
              return item.data
            })
          })
        }

        if (type3) {
          series.push({
            name: asenConfig.getSensorName(this.sensor) + title3,
            type: type3,
            data: data3.map(function (item) {
              return item.data
            })
          })
        }

        let option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: legendData
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data1.map(function (item) {
              return item.time
            })
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            scale: true
          },
          dataZoom: [{
            start: 0,
            end: 100
          }],
          series: series
        }
        if (title1 !== '每小时平均值') {
          delete option.dataZoom
        }
        chart.setOption(option)
      },
      setDateType (dateType) {
        this.dateType = dateType
      },
      getSensorName: asenConfig.getSensorName,
      getHistoryData () {
        if (!this.device_id || !this.sensor) {
          return
        }
        let dateTimes = dateUtil.dateRange(this.dateType)
        chart.clear()
        chart.showLoading()
        this.$http.get('/data/his/' + this.device_id + '/' + this.sensor + '?startTime=' + dateTimes[0] + '&endTime=' + dateTimes[1]).then(result => {
          chart.hideLoading()
          if (result.success) {
            this.hisData = result.data[this.sensor]
            if (this.hisData && this.hisData.length) {
              setChartOption(this.sensor, {
                xAxis: {
                  data: result.data[this.sensor].map(function (item) {
                    return item[0].replace(' ', '\n')
                  })
                },
                series: {
                  name: asenConfig.getSensorName(this.sensor),
                  data: result.data[this.sensor].map(function (item) {
                    return item[1]
                  })
                }
              })
            } else {
              setChartOption(this.sensor, {
                series: []
              })
            }
          } else {
            this.hisData = []
          }
        })
      }
    },
    beforeMount () {
      this.$on('changeSensor', function (sensor) {
        this.$broadcast('changeSensor', sensor)
        if (this.sensor !== sensor) {
          this.sensor = sensor
          this.getHistoryData()
        }
      })

      this.$on('changeDevice', device => {
        this.$broadcast('changeDevice', device)
        if (this.device_id !== device.id) {
          this.device_id = device.id
          this.getHistoryData()
        }
      })
    },
    mounted () {
      // 基于准备好的dom，初始化echarts实例
      chart = echarts.init(document.getElementById('chart'))

      let $dateTypes = $('.date-type-btn-group').on('click', '.btn', () => {
        let $this = $(this)
        $dateTypes.find('.btn').removeClass('btn-primary').removeClass('active').addClass('btn-white')
        $this.removeClass('btn-white').addClass('btn-primary').addClass('active')
      })

      $daterange = $('.input-daterange').datepicker({
        todayBtn: 'linked',
        language: 'zh-CN',
        autoclose: true,
        todayHighlight: true,
        orientation: 'bottom left'
      })
    }
  }
</script>

<style scoped lang="scss">
  .ibox {
    margin-bottom: 0;
  }

  .detail-info {
    padding-bottom: 80px;
  }

  #dataTable {
    background: #f8f9fb;
  }

  .device-list-wrapper,
  .sensor-list-wrapper {
    border-right: 1px solid #ddd;
    padding-right: 0;
    padding-left: 0;
  }

  .list-wrapper {
    padding-left: 0;
    padding-right: 0;
  }

  #monitorItems .text-danger {
    color: #ed5565 !important;
  }
</style>
