<template>
  <div class="container-fluid">
    <div class="wrapper wrapper-content animated fadeIn col-md-12">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox">
            <div class="ibox-title">
              <h5>排行榜</h5>
            </div>
            <div class="ibox-content">
              <div class="table-responsive">
                <table class="dataTable display cell-border compact hover order-column row-border stripe" id="table" data-page-length='25' width="2500px">
                  <thead>
                  <tr>
                    <th>排名</th>
                    <th>设备名称</th>
                    <th v-for="sensor in allSensors">{{sensor.name}}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="data in monitorData">
                    <td></td>
                    <td :title="data.device_id">{{data.name_sn}}</td>
                    <td v-for="sensor in allSensors">{{getDisplayValue(data[sensor.id], sensor.id)}}</td>
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
</template>

<script>
  import asenConfig from '@/assets/js/asenConfig'
  import chinese from '@/assets/js/datatable.language'
  let dataTable = require('datatables.net')
  $.fn.DataTable = dataTable
  export default {
    data () {
      return {
        monitorData: [],
        allSensors: asenConfig.allSensors
      }
    },
    mounted () {
      this.loadMonitorData()
    },
    methods: {
      getDisplayValue (value, sensor) {
        let data = asenConfig.getDisplayValue(value, sensor)
        if (data === '无数据') {
          return ''
        } else {
          return data
        }
      },
      loadMonitorData () {
        return this.$http.get('/monitor').then(result => {
          console.log(result.data.data)
          if (result && result.data.success) {
            this.monitorData = result.data.data
            this.$nextTick(() => {
              let $table = $('#table')
              if ($.fn.DataTable.isDataTable('#table')) {
                return
              }
              $table.DataTable({
                language: chinese,
                'scrollY': '60vh',
                'scrollCollapse': true,
                'scrollX': true,
                fixedColumns: {
                  leftColumns: 2
                },
                'columnDefs': [
                  {
                    targets: 0,
                    visible: false,
                    'className': 'text-right',
                    render: (data, type, row, meta) => {
                      return meta.row + 1
                    },
                    width: '10px'
                  },
                  {
                    targets: 1,
                    width: '100px'
                  },
                  {
                    'orderDataType': 'numeric',
                    'className': 'text-right',
                    'targets': [2, 3, 4, 5, 6, 7, 8, 9, 10]
                  }
                ],
                'lengthMenu': [
                  [10, 25, 50, -1],
                  [10, 25, 50, '所有']
                ]
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
  .wrapper-content {
    padding: 0;
  }
</style>
