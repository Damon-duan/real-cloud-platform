<template>
  <div class="row">
    <div class="wrapper wrapper-content animated fadeIn">
      <div class="ibox">
        <div class="ibox-content">
          <div class="row">
            <div class="col-md-12 m-b-md">
              <h2 style="font-size: 14px">传感器信息</h2>
            </div>
            <div class="col-lg-5">
              <dl class="dl-horizontal">
                <dt>设备:</dt>
                <dd>
                  <span>{{device.name}}</span>
                  <span class="label label-primary" style="margin-left: 5px;" v-if="device.isOnline">在线</span>
                  <span class="label label-danger" style="margin-left: 5px;" v-else>离线</span>
                </dd>
                <dt>设备ID:</dt>
                <dd>
                  <span>{{device.id}}</span>
                </dd>
              </dl>
            </div>
            <div class="col-lg-7">
              <dl class="dl-horizontal">
                <dt>传感器:</dt>
                <dd>
                  <span>{{getSensorName(sensor)}}</span>
                </dd>
              </dl>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-5">
              <dl class="dl-horizontal">
                <dt>当前值:</dt>

                <dd>{{getDisplayValue(rt_data[1], sensor)}} <span
                  v-if="getDisplayValue(rt_data[1], sensor) != '无数据'">{{getUnit(sensor)}}</span></dd>

                <dt v-show="getStandard(sensor)">标准值:</dt>
                <dd v-show="getStandard(sensor)">{{getStandard(sensor)}} {{getUnit(sensor)}}</dd>
              </dl>
            </div>
            <div class="col-lg-7" id="cluster_info">
              <dl class="dl-horizontal">
                <dt>更新时间:</dt>
                <dd>{{rt_data[0]}}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import asenConfig from '@/assets/js/asenConfig'
  export default {
    data () {
      return {
        rt_data: ['', ''],
        his_data: {},
        sensor: '',
        device: {}
      }
    },
    methods: {
      getUnit: asenConfig.getUnit,
      getStandard: asenConfig.getStandard,
      getSensorName: asenConfig.getSensorName,
      getDisplayValue: asenConfig.getDisplayValue,
      loadRealTimeData () {
        if (!this.device_id || !this.sensor) {
          return $.Deferred().reject()
        }
        return this.$http.get('/data/rt/' + this.device_id + '/' + vm.sensor).then(function (result) {
          if (result.data.success) {
            this.rt_data = result.data.data
          }
        })
      }
    },
    mounted () {
      this.$on('changeSensor', function (sensor) {
        if (this.sensor !== sensor) {
          this.sensor = sensor
          this.loadRealTimeData()
        }
      })

      this.$on('changeDevice', function (device) {
        if (this.device_id !== device.id) {
          this.device_id = device.id
          this.device = device
          this.loadRealTimeData()
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  .wrapper-content {
    padding: 0;
  }

  .ibox-content {
    border: none;
    background: #f8f9fb;
  }
</style>
