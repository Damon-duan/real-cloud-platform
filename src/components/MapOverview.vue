<template>
  <div class="container-fluid">
    <div class="map-container" id="map-container"></div>
    <div id="layerHolder" class="layerHolder" :class="{closed: btn}">
      <a id="dragtool" @click="tabPanel()">&gt;</a>
      <div class="holder-heading">
        <h5 class="holder-title">设备列表</h5>
      </div>
      <div class="holder-body">
        <div class="tab-content">
          <div id="table-list" class="tab-panel active">
            <div class="loading" style="display: none;"></div>
            <div id="search-box" style="display: none;">
              <div class="search-wraper clearfix">
                <p class="error-content" style="display: none;"></p>
              </div>
            </div>
            <div class="error-panel">
              共有
              <span id="error-total">{{devices.length}}</span> 条数据,当前页有
              <span id="error-current">{{this.getOnlinePoints().length}}</span> 条数据在线
            </div>
            <div id="data-panel" class="ps-container ps-theme-default">

              <div class="htBorders" style="display: none;">
                <div class="tdclick-top"></div>
                <div class="tdclick-right"></div>
                <div class="tdclick-bottom"></div>
                <div class="tdclick-left"></div>
                <div class="tdclick-dot"></div>
              </div>
              <p id="remind-message" style="display:none">无相关结果</p>

              <div class="tablewrapper" style="display: block;">
                <table class="table-group" cellpadding="0" cellspacing="0">
                  <thead class="table-head">
                    <tr id="tr-head">
                      <th style="min-width: 50px;">ID</th>
                      <th style="min-width: 120px;">名称</th>
                      <th>状态</th>
                      <th>描述</th>
                      <th class="item-longitude">经度</th>
                      <th class="item-latitude">纬度</th>
                      <th class="item-address">地址</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="device in devices" @click="openPointInfoWindow(device)">
                      <td data-type="id">{{device.device_id}}</td>
                      <td class="item-name" data-type="name">{{device.name_sn}}</td>
                      <td data-type="online_ind" :class="{'text-danger': !device.online_ind, 'text-success': device.online_ind}">
                        {{device.online_ind ? '在线' : '离线'}}
                      </td>
                      <td>{{device.description}}</td>
                      <td class="item-longitude" data-type="geo-x">{{device.lng}}</td>
                      <td class="item-latitude" data-type="geo-y">{{device.lat}}</td>
                      <td class="item-address" data-type="address">
                        <div>{{device.address}}</div>
                      </td>
                    </tr>
                  </tbody>
                  <tbody class="error-group" style="display:none"></tbody>
                </table>
              </div>
            </div>
            <div id="pager" style="display: none;"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="map-footer">
      <div class="map-filter">
        <div class="btn-group" role="group" aria-label="...">
          <button @click="showStatusMarkers(-1)" type="button" class="btn btn-default text-info">全部</button>
          <button @click="showStatusMarkers(1)" type="button" class="btn btn-default text-success">在线</button>
          <button @click="showStatusMarkers(0)" type="button" class="btn btn-default text-warn">离线</button>
          <button @click="clickShowAlarm()" type="button" class="btn btn-default text-danger">报警 <span
            class="text-danger badge alarm-badge">{{alarms.length ? alarms.length : ''}}</span></button>
          <div class="btn-group dropup" role="group">
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              参数
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
              <li v-for="data in allSensors">
                <a @click="showSensorMarkers(data.id)">
                  <i class="icon iconfont" :class="data.icon"></i> {{data.name}}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="map-message text-danger"></div>
    </div>
  </div>
</template>

<script>
  import asenConfig from '@/assets/js/asenConfig'
  import dateUtil from '@/assets/js/DateUtil'
  let map = null
  let deviceId = asenConfig.device_id
  let statusMarkers = []
  let sensorMarkers = []
  let realTimeInterval
  let alarmInterval
  let monitorTimer = 5000
  let latestMonitor = []
  let monitorPromise
  let alarmPromise
  let isShowingAlarm = false
  export default {
    name: 'MapOverview',
    data () {
      return {
        devices: [],
        device_id: deviceId,
        allSensors: asenConfig.allSensors,
        alarms: [],
        btn: 0
      }
    },
    beforeDestroy () {
      realTimeInterval && clearInterval(realTimeInterval)
      alarmInterval && clearInterval(alarmInterval)
      statusMarkers = []
      sensorMarkers = []
    },
    mounted () {
      $('.map-container').height($('body').height() - 51)
      this.$http.get('/user/devices').then(res => {
        let result = res.data
        if (result.success) {
          this.devices = result.data
        } else {
          this.devices = []
        }

        map = new AMap.Map('map-container', {
          resizeEnable: true,
          zoom: 5,
          center: [116.480983, 40.0958]
        })

        for (let i = 0; i < this.devices.length; i++) {
          this.addMarker(this.devices[i])
        }
        // 地图自适应地图的markers
        map.setFitView()
      })
      this.getRealtimeData()
      this.getAlarmData()
    },
    methods: {
      showSensorMarkers (sensor) {
        isShowingAlarm = false
        if (!map && !sensor) {
          return
        }
        if (statusMarkers && statusMarkers.length) {
          statusMarkers.map(marker => {
            marker.hide()
          })
        }
        if (sensorMarkers && sensorMarkers.length) {
          map.remove(sensorMarkers)
        }
        monitorPromise.then(() => {
          console.log(latestMonitor)
          if (latestMonitor && latestMonitor.data.length && this.devices) {
            latestMonitor.data.map(item => {
              this.addSensorMarker(
                this.getDeviceById(item.device_id),
                sensor,
                item[sensor]
              )
            })
          }
        })
      },
      clickShowAlarm () {
        isShowingAlarm = true
        this.showAlarm()
      },
      showAlarm () {
        if (sensorMarkers && sensorMarkers.length) {
          map.remove(sensorMarkers)
        }
        if (statusMarkers && statusMarkers.length) {
          statusMarkers.map(marker => {
            marker.hide()
          })

          statusMarkers.filter(marker => {
            return marker.getExtData().isAlarm === true
          }).map(marker => {
            marker.show()
          })
        }
      },
      showStatusMarkers (status) {
        isShowingAlarm = false
        if (!map) {
          return
        }
        if (sensorMarkers && sensorMarkers.length) {
          map.remove(sensorMarkers)
        }
        if (statusMarkers && statusMarkers.length) {
          statusMarkers.map(marker => {
            marker.hide()
          })
          if (status === -1) {
            statusMarkers.map(marker => {
              marker.show()
            })
            return
          }

          statusMarkers.filter(marker => {
            return marker.getExtData().status === status
          }).map(marker => {
            marker.show()
          })
        }
      },
      addSensorMarker (device, sensor, value) {
        if (!device.lng || !device.lat) {
          return
        }

        let lnglat = new AMap.LngLat(device.lng, device.lat)
        let displayValue = asenConfig.getDisplayValue(value, sensor)
        let displayItem = displayValue + ' ' + asenConfig.getUnit(sensor)
        let content = '<div class="amap-ui-district-cluster-marker" title="' + device.name_sn + '"><span class="amap-ui-district-cluster-marker-title">' + asenConfig.getSensorName(sensor) + '</span><span class="amap-ui-district-cluster-marker-body success">' + displayItem + '</span></div>'
        if (displayValue === '无数据') {
          content = '<div class="amap-ui-district-cluster-marker" title="' + device.name_sn + '"><span class="amap-ui-district-cluster-marker-title">' + asenConfig.getSensorName(sensor) + '</span><span class="amap-ui-district-cluster-marker-body">' + displayValue + '</span></div>'
        }
        let marker = new AMap.Marker({
          extData: {
            id: device.device_id
          },
          title: device.name_sn,
          map: map,
          position: lnglat,
          content: content // 自定义点标记覆盖物内容
        })
        sensorMarkers.push(marker)

        AMap.event.addListener(marker, 'click', function () {
          this.device_id = device.device_id
          this.$http.get('/data/rt/' + device.device_id).then(result => {
            let infoWindow = null
            let sContent = ''
            if (result.success) {
              sContent = this.createInfoContent(this.getDeviceById(device.device_id), result.data)
            }
            infoWindow = new AMap.InfoWindow({
              isCustom: true, // 使用自定义窗体
              content: this.createInfoWindow('ID:' + device.device_id, sContent),
              offset: new AMap.Pixel(14, -53)
            })
            infoWindow.open(map, marker.getPosition())
          })
        })
      },
      addMarker (device) {
        if (!device.lng || !device.lat) {
          return
        }
        let lnglat = new AMap.LngLat(device.lng, device.lat)
        let marker = new AMap.Marker({
          extData: {
            id: device.device_id,
            status: device.online_ind
          },
          title: device.name_sn,
          map: map,
          position: lnglat,
          icon: device.online_ind ? 'src/assets/images/online.png' : 'src/assets/images/offline.png'
        })
        statusMarkers.push(marker)
        AMap.event.addListener(marker, 'click', () => {
          this.device_id = device.device_id
          this.$http.get('/data/rt').then(res => {
            let infoWindow
            let sContent = ''
            let result = res.data
            if (result.success) {
              sContent = this.createInfoContent(this.getDeviceById(device.device_id), result.data)
            }
            infoWindow = new AMap.InfoWindow({
              isCustom: true, // 使用自定义窗体
              content: this.createInfoWindow('ID:' + device.device_id, sContent),
              offset: new AMap.Pixel(14, -53)
            })
            infoWindow.open(map, marker.getPosition())
          })
        })
      },
      createInfoContent (device, rtData) {
        let sContent = ''
        if (device.online_ind) {
          sContent += '<div class="info-content">'
          sContent += '<div class="info-item">'
          sContent += '<span class="info-name">名称</span>'
          sContent += '<span>' + device.name_sn + '</span>'
          sContent += '</div>'
          sContent += '<div class="info-item">'
          sContent += '<span class="info-name">更新时间</span>'
          sContent += '<span class="info-value">' + rtData.rt_data.datetime + '</span>'
          sContent += '</div>' + this.createSensorContent(rtData.rt_data) + '</div>'
        } else {
          sContent += '<div class="info-content">'
          sContent += '<span class="info-name">名称</span>'
          sContent += '<span>' + device.name_sn + '</span>'
          sContent += '</div>'
          sContent += '<div class="info-item">'
          sContent += '<span class="info-name">状态</span>'
          sContent += '<span class="text-danger">离线</span>'
          sContent += '</div>'
          sContent += '</div>'
        }
        return sContent
      },
      createSensorContent (data) {
        let html = ''
        for (let name in data) {
          if (data.hasOwnProperty(name)) {
            if (['device_id', 'datetime'].indexOf(name) !== -1) {
              continue
            }
            if (asenConfig.getDisplayValue(data[name]) !== 0) {
              if (!asenConfig.getDisplayValue(data[name]) || asenConfig.getDisplayValue(data[name]) === '无数据') {
                continue
              }
            }
            html += '<div class="info-item">'
            html += '<span class="info-name">' + asenConfig.getSensorName(name) + '</span>'
            html += '<span class="info-value">' + asenConfig.getDisplayValue(data[name], name) + '</span>'
            html += '<span class="info-unit">' + asenConfig.getUnit(name) + '</span>'
            html += '</div>'
          }
        }
        return html
      },
      getDeviceById (id) {
        for (let i = 0; i < this.devices.length; i++) {
          if (this.devices[i].device_id === id) {
            return this.devices[i]
          }
        }
      },
      createInfoWindow (title, content) {
        let info = document.createElement('div')
        info.className = 'info'

        // 可以通过下面的方式修改自定义窗体的宽高
        // info.style.width = "400px";
        // 定义顶部标题
        let top = document.createElement('div')
        let titleD = document.createElement('div')
        let closeX = document.createElement('img')
        top.className = 'info-top'
        titleD.innerHTML = title
        closeX.src = 'http://webapi.amap.com/images/close2.gif'
        closeX.onclick = this.closeInfoWindow

        top.appendChild(titleD)
        top.appendChild(closeX)
        info.appendChild(top)

        // 定义中部内容
        let middle = document.createElement('div')
        middle.className = 'info-middle'
        middle.style.backgroundColor = 'white'
        middle.innerHTML = content
        info.appendChild(middle)

        // 定义底部内容
        let bottom = document.createElement('div')
        bottom.className = 'info-bottom'
        bottom.style.position = 'relative'
        bottom.style.top = '0px'
        bottom.style.margin = '0 auto'
        var sharp = document.createElement('img')
        sharp.src = 'http://webapi.amap.com/images/sharp.png'
        bottom.appendChild(sharp)
        info.appendChild(bottom)
        return info
      },
      closeInfoWindow () {
        map.clearInfoWindow()
      },
      getOnlinePoints () {
        return this.devices.filter(device => {
          return device.online_ind === true
        })
      },
      openPointInfoWindow (device) {
        let markers = map.getAllOverlays('marker')
        for (let i = 0; i < markers.length; i++) {
          var extData = markers[i].getExtData()
          if (extData && extData.id === device.device_id) {
            this.device_id = device.device_id
            AMap.event.trigger(markers[i], 'click')
            break
          }
        }
        if (device.lng && device.lat) {
          map.panTo(new AMap.LngLat(device.lng, device.lat))
        }
      },
      getRealtimeData () {
        let _this = this
        realTimeInterval = setInterval(() => {
          monitorPromise = _this.$http.get('/monitor').then(result => {
            if (result && result.data.success) {
              latestMonitor = result.data
            }
          })
        }, monitorTimer)
      },
      getAlarmData () {
        let _this = this
        _this.loadAlarm()
        alarmInterval = setInterval(() => {
          _this.loadAlarm()
        }, monitorTimer)
      },
      loadAlarm () {
        alarmPromise = this.$http.get('/monitor/alarm').then(result => {
          if (result && result.success) {
            this.alarms = result.data
            statusMarkers.map(marker => {
              marker.setAnimation('AMAP_ANIMATION_NONE')
              let extData = marker.getExtData()
              extData['isAlarm'] = false
              marker.setExtData(extData)
            })
            if (this.alarms && this.alarms.length) {
              this.alarms.map(alarm => {
                var marker = statusMarkers.find(item => {
                  return item.getExtData().id === alarm.device_id
                })
                if (marker) {
                  marker.setAnimation('AMAP_ANIMATION_BOUNCE')
                  let extData = marker.getExtData()
                  extData['isAlarm'] = true
                  marker.setExtData(extData)
                }
              })
              isShowingAlarm && this.showAlarm()
            }
          }
        })
      },
      tabPanel () {
        this.btn = !this.btn
      }
    }
  }
</script>

<style lang="scss">
  .layerHolder {
    position: absolute;
    top: 50px;
    left: -865px;
    bottom: 34px;
    width: 865px;
    z-index: 200;
    background-color: $bg1;
    @include transition(0.3s);
    .holder-title {
      line-height: 20px;
      height: 20px;
      width: 320px;
      margin: 10px 0;
      font-size: 14px;
      color: inherit;
    }
    .holder-heading {
      overflow: hidden;
      position: relative;
      color: #fff;
      background-color: $bg2;
      padding: 0 15px;
    }
    .holder-body {
      position: absolute;
      left: 0;
      top: 40px;
      bottom: 0;
      width: 100%;
    }
    p.table-id {
      margin-top: 10px;
      margin-left: 20px;
    }
    .item-num-name {
      .item-num {
        display: inline-block;
        margin: 0 8px 0 2px;
      }
    }
    a.publish {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      border: 0;
      display: block;
      width: 20px;
      height: 20px
    }
    .tablewrapper {
      padding-left: 10px;
      padding-right: 10px;
    }
    &.closed {
      left: 0;
    }
  }

  #data-panel {
    position: absolute;
    top: 24px;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  .width-transition {
    -webkit-transition: width .4s;
    transition: width .4s
  }

  #dragtool {
    cursor: pointer;
    position: absolute;
    right: -15px;
    top: 50%;
    z-index: 201;
    background: $bg1;
    width: 15px;
    height: 64px;
    line-height: 64px;
    font-family: 'SimSun';
    text-align: center;
    color: $color1;
  }

  #mymap-name {
    display: inline-block;
    border-bottom: 1px solid transparent;
    height: 22px;
    line-height: 22px
  }

  .edit-tablename-btn {
    display: inline-block;
    margin-left: 5px;
    cursor: pointer
  }

  input.edit-name {
    width: 240px;
    height: 16px;
    padding: 3px 1px;
    border: none;
    border-bottom: 1px solid hsla(0, 0%, 100%, .5);
    background-color: transparent;
    color: #fff;
    font-size: 14px
  }

  .save-tablename {
    display: inline-block;
    float: right;
    margin: -4px 10px;
    border: 1px solid #fff;
    padding: 0 10px;
    cursor: pointer;
    border-radius: 4px
  }

  #layer {
    border-right: 1px solid #ccc;
    box-shadow: 2px 0 3px 0 rgba(0, 0, 0, .12)
  }

  div.tab-content {
    height: 100%;
    .tab-panel {
      position: relative;
      height: 100%;
    }
  }

  .loadingoverlayer {
    width: 100%;
    height: 100%;
    background-color: hsla(0, 0%, 100%, 0);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    display: none
  }

  .triangle-border {
    position: absolute;
    left: 50%;
    margin-left: -5px;
    overflow: hidden;
    width: 0;
    height: 0;
    border-width: 5px;
    border-style: dashed dashed solid;
    border-color: transparent transparent #f8f8f8
  }

  .launched .triangle-border {
    left: 175px
  }

  #column-item-template {
    height: 25px;
    padding: 5px
  }

  .table-group {
    width: 100%;
    white-space: nowrap;
    border-top: 1px solid $color1;
    border-left: 1px solid $color1;
    .wrap {
      width: 52px;
      display: inline-block;
      margin-right: 13px
    }
    tbody {
      tr {
        &:hover, &.selected {
          background: rgba(0, 145, 255, .05);
          cursor: pointer;
        }
        &.selected {
          color: #0091ff;
        }
        &.offline {
          color: #aaaaaa;
        }
      }
    }
    .table-head {
      th {
        background-color: $bg2;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid $color1;
        padding: 0 6px;
        border-right: 1px solid $color1;
        font-weight: 400;
      }
      td {
        background-color: $color1
      }
    }
    .item-createTime, .item-updateTime {
      padding-right: 15px
    }
    td {
      &.error {
        background-color: #fbcece
      }
      height: 30px;
      line-height: 30px;
      padding: 0 6px;
      border-bottom: 1px solid $color1;
      border-right: 1px solid $color1;
    }
  }

  #tr-head {
    .serial {
      padding-left: 13px
    }
    td {
      span {
        cursor: pointer;
        padding: 3px;
        position: relative;
        .jmenu {
          display: none
        }
        &.spanselected {
          display: block
        }
        b {
          font-weight: 400;
          max-width: 130px;
          overflow: hidden;
          height: 16px;
          line-height: 16px;
          white-space: nowrap;
          text-overflow: ellipsis
        }
      }
    }
  }

  #tr-head td > span:after, #tr-head td span b {
    @extend .vam;
  }

  #tr-head td > span:after {
    content: "";
    width: 0;
    margin-left: 5px;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid #666
  }

  #tr-head td.tdselected > span:after {
    -o-transform: rotate(180deg)
  }

  #tr-head td.focus > span:after, #tr-head td.tdselected > span:after {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -ms-transform: rotate(180deg)
  }

  .error-group td > div, .list-group td > div {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-right: 5px;
    min-width: 30px;
    max-width: 240px
  }

  .table-group td[class^=item-props] > div {
    margin-right: 15px
  }

  .ps-container {
    -ms-touch-action: none;
    overflow: auto
  }

  .ps-container.ps-active-x > .ps-scrollbar-x-rail, .ps-container.ps-active-y > .ps-scrollbar-y-rail {
    display: block
  }

  .ps-container.ps-in-scrolling {
    pointer-events: none
  }

  .ps-container > .ps-scrollbar-x-rail {
    display: none;
    position: absolute;
    bottom: 0;
    height: 8px
  }

  .ps-container > .ps-scrollbar-x-rail > .ps-scrollbar-x {
    position: absolute;
    -webkit-transition: background-color .2s linear;
    transition: background-color .2s linear;
    bottom: 0;
    height: 8px
  }

  .ps-container > .ps-scrollbar-y-rail {
    display: none;
    position: absolute;
    transition: background-color .2s linear, opacity .2s linear;
    right: 0;
    width: 8px
  }

  .ps-container > .ps-scrollbar-y-rail > .ps-scrollbar-y {
    position: absolute;
    -webkit-transition: background-color .2s linear;
    transition: background-color .2s linear;
    right: 0;
    width: 8px
  }

  .ps-container:hover > .ps-scrollbar-x-rail > .ps-scrollbar-x, .ps-container:hover > .ps-scrollbar-y-rail > .ps-scrollbar-y {
    background-color: #d0d0d0
  }

  .ps-container.ps-active-x:hover > .ps-scrollbar-x-rail, .ps-container.ps-active-y:hover > .ps-scrollbar-y-rail {
    background-color: #f5f5f5
  }

  .error-panel {
    height: 24px;
    line-height: 24px;
    padding: 0 15px;
    text-align: center;
    #error-current, #error-total {
      color: red;
    }
  }

  .alarm-badge {
    background-color: #ed5565 !important;
    color: #fff !important;
  }

  .map-filter, .map-message {
    @extend .vam;
  }

  .map-message {
    margin-left: 10px;
  }

  .map-footer {
    background-color: $color2;
    .dropdown-menu {
      height: 470px;
      overflow-y: auto;
      background: $color2;
    }
  }

  #map-container {
    height: calc(100vh - 84px) !important;
  }

  .info-top {
    position: relative;
    background: none repeat scroll 0 0 #F9F9F9;
    border-bottom: 1px solid #CCC;
    border-radius: 5px 5px 0 0;
    div {
      display: inline-block;
      color: #333333;
      font-size: 14px;
      font-weight: bold;
      line-height: 31px;
      padding: 0 10px;
    }
    img {
      position: absolute;
      top: 10px;
      right: 10px;
      transition-duration: 0.25s;
      &:hover {
        box-shadow: 0 0 5px #000;
      }
    }
  }

  .info-middle {
    font-size: 12px;
    padding: 6px;
    line-height: 20px;
    img {
      float: left;
      margin-right: 6px;
    }
  }

  .info-bottom {
    height: 0;
    width: 100%;
    clear: both;
    text-align: center;
    img {
      position: relative;
      z-index: 104;
    }
  }

  .info {
    color: #333333;
    border: solid 1px silver;
    min-width: 209px;
  }

  .info-name {
    width: 60px;
    display: inline-block;
    text-align: right;
    margin-right: 5px;
  }

  .info-unit {
    color: #aaaaaa;
  }

  .info-value {
    color: #1ab394;
  }

  .amap-info-content {
    background: rgba(47, 55, 71, .8) !important;
  }

  tr.list-group-item {
    padding: 0;
    border: 1px;
  }

  .amap-ui-district-cluster-marker {
    border: 1px solid #8e8e8e;
    width: auto;
    height: 22px;
    border-radius: 5px;
    left: 0;
    top: 0;
    &:after, &:before {
      content: '';
      display: block;
      position: absolute;
      width: 0;
      height: 0;
      border: solid rgba(0, 0, 0, 0);
      border-width: 6px;
      left: 13px;
    }
    &:before {
      bottom: -13px;
      border-top-color: #8e8e8e;
    }
    :after {
      bottom: -12px;
      border-top-color: #fffeef;
    }
    span {
      padding: 3px 5px;
      height: 20px;
      line-height: 14px;
      @extend .vam;
    }
  }

  .amap-ui-district-cluster-container .overlay-title,
  .amap-ui-district-cluster-marker {
    color: #555;
    background-color: #fffeef;
    font-size: 12px;
    white-space: nowrap;
    position: absolute;
  }

  .amap-ui-district-cluster-marker-title {
    border-radius: 5px 0 0 0;
  }

  .amap-ui-district-cluster-marker-body {
    background-color: #dc3912;
    color: #fff;
    border-radius: 0 5px 5px 0;
    &.success {
      background-color: #28a745;
    }
  }

  .amap-ui-district-cluster-marker.level_district .amap-ui-district-cluster-marker-body {
    background-color: #d47;
  }
</style>
