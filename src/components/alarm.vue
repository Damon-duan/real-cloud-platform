<template>
  <div class="container-fluid">
    <div class="wrapper wrapper-content animated fadeIn col-md-12">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox">
            <div class="ibox-title">
              <h5>实时告警</h5>
            </div>
            <div class="ibox-content">

              <div class="table-responsive">
                <table class="dataTable display cell-border compact hover order-column row-border stripe" id="table-rt" data-page-length='25' width="2500px">
                  <thead>
                  <tr>
                    <th>设备名称</th>
                    <th v-for="sensor in allSensors">{{sensor.name}}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="data in monitorData">
                    <td :title="data.device_id">
                      {{data.name_sn}}
                    </td>
                    <td v-for="sensor in allSensors">{{getAlarmText(data[sensor.id])}}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper wrapper-content col-md-12">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox">
            <div class="ibox-title">
              <h5>历史告警</h5>
            </div>
            <div class="ibox-content clearfix">
              <div class="col-md-12">
                <div class="form-inline" style="margin-bottom: 20px">
                  <div class="form-group">
                    <label class="font-noraml">选择设备</label>
                    <select data-placeholder="请选择您要查看的设备" class="chosen-select">
                      <option v-for="device in devices" :id="device.device_id">{{device.name_sn}}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="font-noraml">时间</label>
                    <div class="input-daterange input-group" id="datepicker">
                      <input type="text" class="input-sm form-control startTime" name="start" />
                      <span class="input-group-addon">到</span>
                      <input type="text" class="input-sm form-control endTime" name="end" />
                    </div>
                    <button class="btn btn-sm btn-success" type="button" @click="query()">查询</button>
                  </div>
                </div>
              </div>
              <div class="col-md-12 clearfix">
                <div class="table-responsive clearfix">
                  <table class="dataTable display cell-border compact hover order-column row-border stripe" id="table-history" data-page-length='25' width="2500px">
                    <thead>
                    <tr>
                      <th>时间</th>
                      <th v-for="sensor in allSensors">{{sensor.name}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="data in historyData">
                      <td>
                        {{data.datetime}}
                      </td>
                      <td v-for="sensor in allSensors">{{getAlarmText(data[sensor.id])}}</td>
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
</template>

<script>
  import asenConfig from '@/assets/js/asenConfig'
  import chinese from '@/assets/js/datatable.language'
  import dateUtil from '@/assets/js/DateUtil'
  let dataTable = require('datatables.net')
  $.fn.DataTable = dataTable
  let interval
  export default {
    data () {
      return {
        monitorData: [],
        historyData: [],
        allSensors: asenConfig.allSensors,
        devices: {},
        deviceId: null
      }
    },
    beforeDestroy () {
      interval && clearInterval(interval)
    },
    mounted () {
      this.loadMonitorData()
      interval = setInterval(this.loadMonitorData, 5000)

      this.loadUserDevice()

      $('.input-daterange').datepicker({
        todayBtn: 'linked',
        language: 'zh-CN',
        autoclose: true,
        todayHighlight: true
      })
    },
    methods: {
      query () {
        let startDate = $('.input-daterange .startTime').datepicker('getDates')[0]
        let endDate = $('.input-daterange .endTime').datepicker('getDates')[0]

        if (!this.deviceId) {
          toastr.error('没有选择设备')
          return
        }

        if (!startDate || !endDate) {
          toastr.error('没有选择开始结束时间')
          return
        }

        let params = {
          deviceId: this.deviceId,
          startDate: dateUtil.format(new Date(startDate), 'yyyy-MM-dd 00:00:00'),
          endDate: dateUtil.format(new Date(endDate), 'yyyy-MM-dd 23:59:59')
        }
      },
      getAlarmText (value) {
        let data = asenConfig.getAlarmText(value)
        if (data === 'null') {
          return ''
        } else {
          return data
        }
      },
      loadHistoryData (param) {
        return this.$http.post('/monitor/alarm/history', param).then(result => {
          this.historyData = []
          this.$nextTick(() => {
            if (result && result.data.success) {
              this.historyData = result.data.data
              this.$nextTick(() => {
                let $table = $('#table-history')
                if (!$.fn.DataTable.isDataTable('#table-history')) {
                  $table.DataTable({
                    language: chinese,
                    'bSort': false,
                    'searching': false,
                    'scrollY': '60vh',
                    'scrollCollapse': true,
                    'scrollX': true,
                    fixedColumns: {
                      leftColumns: 2
                    },
                    'columnDefs': [{
                      targets: 0,
                      width: '100px'
                    }],
                    'lengthMenu': [
                      [10, 25, 50, -1],
                      [10, 25, 50, '所有']
                    ]
                  })
                }
                $table.DataTable()
              })
            }
          })
        })
      },
      loadMonitorData () {
        return this.$http.get('/monitor/alarm').then(result => {
          if (result && result.data.success) {
            this.monitorData = result.data.data
            this.$nextTick(() => {
              let $table = $('#table-rt')
              if ($.fn.DataTable.isDataTable('#table-rt')) {
                return
              }
              $table.DataTable({
                language: chinese,
                'bSort': false,
                'searching': false,
                paging: false,
                'scrollY': '60vh',
                'scrollCollapse': true,
                'scrollX': true,
                fixedColumns: {
                  leftColumns: 1
                },
                'columnDefs': [{
                  targets: 0,
                  width: '100px'
                }],
                'lengthMenu': [
                  [10, 25, 50, -1],
                  [10, 25, 50, '所有']
                ]
              })
            })
          }
        })
      },
      loadUserDevice () {
        return this.$http.get('/user/devices').then(result => {
          if (result.data.success) {
            this.devices = result.data.data
            if (this.devices && this.devices.length) {
              this.deviceId = this.devices[0].device_id
            }

            this.$nextTick(() => {
              $('.chosen-select').chosen({
                no_results_text: '未找到您要查找的选项!'
              }).change(item => {
                this.deviceId = $(this).find('option:selected').map(() => {
                  return $(this).prop('id')
                }).get()[0]
              })
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .text-right {
    text-align: right;
  }
</style>
