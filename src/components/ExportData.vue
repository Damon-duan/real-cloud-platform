<template>
  <div class="container-fluid">
    <div class="ibox float-e-margins animated fadeIn">
      <div class="ibox-title">
        <h5>数据导出</h5>
      </div>
      <div class="ibox-content">
        <form class="form-horizontal">

          <div class="form-group">
            <label class="col-lg-1 control-label">传感器</label>

            <div class="col-lg-11">
              <div class="checkbox checkbox-success checkbox-inline" v-for="senor in senors">
                <input type="checkbox" class="sensors" :id="senor.id" :value="senor.id" checked>
                <label :for="senor.id"> {{ senor.name }} </label>
              </div>
            </div>
          </div>
          <div class="form-group datepicker-container">
            <label class="col-lg-1 control-label">时间范围</label>

            <div class="col-lg-5">
              <div class="input-daterange input-group" id="datepicker">
                <input type="text" class="input-sm form-control startTime" name="start"/>
                <span class="input-group-addon">到</span>
                <input type="text" class="input-sm form-control endTime" name="end"/>
              </div>
            </div>
            <div class="col-lg-1 pull-right">
              <button class="btn btn-sm btn-success" type="button" @click="download()">下载</button>
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-1 control-label">设备</label>

            <div class="col-lg-11">
              <table class="table table-bordered">
                <thead>
                <tr>
                  <th>设备id</th>
                  <th>名称</th>
                  <th>描述</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="device in devices">
                  <th scope="row">
                    <div class="checkbox checkbox-success checkbox-inline">
                      <input type="checkbox" class="devices" :id="device.device_id" :value="device.device_id">
                      <label :for="device.device_id"> {{ device.device_id }} </label>
                    </div>
                  </th>
                  <td>{{ device.name_sn }}</td>
                  <td>{{ device.description }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import asenConfig from '@/assets/js/asenConfig'
  import dateUtil from '@/assets/js/DateUtil'
  export default {
    data () {
      return {
        devices: {},
        senors: asenConfig.getAllSensors()
      }
    },
    mounted () {
      this.loadUserDevice()

      $('.input-daterange').datepicker({
        todayBtn: 'linked',
        language: 'zh-CN',
        autoclose: true,
        todayHighlight: true
      })
    },
    methods: {
      loadUserDevice () {
        return this.$http.get('/user/devices').then(result => {
          if (result.data.success) {
            this.devices = result.data.data
          }
        })
      },
      download () {
        let devices = []
        let sensors = []
        $('.devices:checked').each((index, item) => {
          devices.push($(item).val())
        })
        $('.sensors:checked').each((index, item) => {
          sensors.push($(item).val())
        })

        let startDate = $('.input-daterange .startTime').datepicker('getDates')[0]
        let endDate = $('.input-daterange .endTime').datepicker('getDates')[0]

        if (!devices || !devices.length) {
          toastr.error('没有选择设备')
          return
        }

        if (!sensors || !sensors.length) {
          toastr.error('没有选择传感器')
          return
        }

        if (!startDate || !endDate) {
          toastr.error('没有选择开始结束时间')
          return
        }

        let params = {
          devices: devices,
          sensors: sensors,
          startDate: dateUtil.format(new Date(startDate), 'yyyy-MM-dd 00:00:00'),
          endDate: dateUtil.format(new Date(endDate), 'yyyy-MM-dd 23:59:59')
        }
        let url = '/history/export'
        $.fileDownload(url, {
          httpMethod: 'POST',
          data: params
        }).done(() => {

        }).fail(() => {
          toastr.error('下载失败')
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  label {
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
  }
</style>
