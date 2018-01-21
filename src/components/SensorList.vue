<template>
  <div>
    <div class="device-selector">
      <div class="form-group">
        <label class="font-noraml">选择设备</label>
        <select data-placeholder="请选择您要查看的设备" style="width: 100%" class="chosen-select">
          <option v-for="device in devices" :id="device.device_id">{{device.name_sn}}</option>
        </select>
      </div>
    </div>
    <table id="monitorItems" class="col-md-12">
      <tr @click="setSensor(sensor.id)" v-for="sensor in allSensors">
        <td class="name">
          <i class="icon iconfont" :class="sensor.icon"></i>{{sensor.name}}</td>
        <td class="value">
          <span>{{getDisplayVal(rt_data[sensor.id], sensor.id)}}</span>
        </td>
        <td class="unit">
          <small> {{sensor.unit}}</small>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import asenConfig from '@/assets/js/asenConfig'
  export default {
    data () {
      return {
        allSensors: asenConfig.allSensors,
        device: {},
        sensor: 'p25',
        rt_data: {},
        devices: {},
        device_id: asenConfig.device_id
      }
    },
    methods: {
      getDisplayVal: asenConfig.getDisplayValue,
      setSensor (sensor) {
        this.sensor = sensor
        this.$dispatch('changeSensor', sensor)
      },
      setDevice (device) {
        if (this.device.id !== device.id) {
          this.$dispatch('changeDevice', device)
        }
      },
      isSameSensor (sensor) {
        return this.sensor === sensor
      },
      loadSensorData () {
        if (!this.device_id) {
          return
        }
        return this.$http.get('/data/rt/' + this.device_id).then(result => {
          if (result.data.success) {
            this.setSensor(this.sensor)
            this.setDevice(result.data.data.device)

            this.device = result.data.data.device
            this.rt_data = result.data.data.rt_data ? result.data.data.rt_data : {}
          }
        })
      },
      loadUserDevice: function () {
        return this.$http.get('/user/devices/').then(result => {
          if (result.data.success) {
            this.devices = result.data.data
            if (this.devices && this.devices[0]) {
              this.device_id = this.devices[0].device_id
            }
          }
        })
      }
    },
    watch: {
      'devices': function () {
        $('.chosen-select').chosen({no_results_text: '未找到您要查找的选项!'}).change(item => {
          this.device_id = $(this).find('option:selected').map(function () {
            return $(this).prop('id')
          }).get()[0]
        })
      },
      'device_id': function () {
        this.loadSensorData()
      }
    },
    mounted () {
      this.loadUserDevice().done(function () {
        Vue.nextTick(function () {
          $(".chosen-select").chosen({no_results_text: "未找到您要查找的选项!"});
        })

      });
      this.loadSensorData();
      var $monitorItems = $('#monitorItems').on('click', 'tr', function () {
        $monitorItems.find('.active').removeClass('active');
        $(this).addClass('active');
      });
    }
  }
</script>

<style scoped lang="scss">
  .device-selector {
    padding: 10px;
  }

  .device-selector .chosen-container {
    width: 80%;
    display: block;
  }

  #monitorItems {
    text-align: center;
    overflow-y: auto;
  }

  #monitorItems tr {
    cursor: pointer;
  }

  #monitorItems tr:hover {
    background: rgba(0, 0, 0, .04);
  }

  #monitorItems tr.active {
    background: rgba(0, 0, 0, .08);
  }

  #monitorItems .name {
    text-align: left;
    padding-left: 15px;
    color: rgba(0, 0, 0, .75);
  }

  #monitorItems .value {
    color: #1ab394;
    text-align: right;
  }

  #monitorItems .unit {
    color: #aaa;
    text-align: right;
    padding-right: 15px;
  }

  #monitorItems .iconfont {
    font-size: 20px;
    margin-right: 5px;
    text-align: right;
  }
</style>
