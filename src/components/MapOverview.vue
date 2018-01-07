<template>
  <div class="container-fluid">
    <div class="map-container" id="map-container"></div>
    <div id="layerHolder" class="layerHolder" style="width: 348px;">
      <a id="dragtool" class="closed"></a>

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
              <span id="error-total"></span> 条数据,当前页有
              <span id="error-current"></span> 条数据在线
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
                  <tr>
                    <td data-type="id"></td>
                    <td class="item-name" data-type="name"></td>
                    <td data-type="online_ind">

                    </td>
                    <td></td>
                    <td class="item-longitude" data-type="geo-x"></td>
                    <td class="item-latitude" data-type="geo-y"></td>
                    <td class="item-address" data-type="address">
                      <div></div>
                    </td>
                  </tr>
                  </tbody>
                  <tbody class="error-group" style="display:none"></tbody>
                </table>
              </div>
            </div>
            <div id="pager" style="display: none;">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="map-footer">
      <div class="map-filter">
        <div class="btn-group" role="group" aria-label="...">
          <button type="button" class="btn btn-default text-info">全部</button>
          <button type="button" class="btn btn-default text-success">在线</button>
          <button type="button" class="btn btn-default text-warn">离线</button>
          <button type="button" class="btn btn-default text-danger">报警 <span class="text-danger badge alarm-badge"></span></button>
          <div class="btn-group dropup" role="group">
            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              参数
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
              <li>
                <a>
                  <i class="icon iconfont"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="map-message text-danger">{{msg}}</div>
    </div>
  </div>

</template>

<script>
  let map = null
  let statusMarkers = []
  export default {
    name: 'MapOverview',
    data () {
      return {
        msg: '1313212',
        vm: {}
      }
    },
    mounted () {
      let _this = this
      $('.map-container').height($('body').height() - 51)
      _this.$http.get('/user/devices').then(res => {
        let result = res.data
        console.log(result)
        if (result.success) {
          _this.vm.devices = result.data
        } else {
          _this.vm.devices = []
        }

        map = new AMap.Map('map-container', {
          resizeEnable: true,
          zoom: 5,
          center: [116.480983, 40.0958]
        })

        for (let m = 0; m < _this.vm.devices.length; m++) {
          _this.addMarker(_this.vm.devices[m], _this)
        }
        // 地图自适应地图的markers
        map.setFitView()
      })
    },
    methods: {
      addMarker: (device, This) => {
        let _this = This
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
          _this.vm.device_id = device.device_id
          _this.$http.get('/data/rt/' + device.device_id).then(res => {
            let infoWindow = null, sContent = '', result = res.data
            if (result.success) {
              sContent = createInfoContent(_this.vm.getDeviceById(device.device_id), result.data)
            }
            infoWindow = new AMap.InfoWindow({
              isCustom: true, // 使用自定义窗体
              content: createInfoWindow('ID:' + device.device_id, sContent),
              offset: new AMap.Pixel(14, -53)
            })
            infoWindow.open(map, marker.getPosition())
          })
        })
      }
    }
  }
</script>


<style scoped lang="scss">
  .layerHolder {
    position: absolute;
    top: 50px;
    left: 0;
    width: 368px;
    z-index: 200;
    background-color: rgba(2, 21, 41, 0.9);
    .holder-title {
      line-height: 20px;
      height: 20px;
      width: 320px;
      margin: 10px 0;
      font-size: 14px;
      color: inherit;
      font-family: \\5FAE\8F6F\96C5\9ED1
    }
    .holder-heading {
      overflow: hidden;
      position: relative;
      color: #fff;
      background-color: #335891;
      padding: 0 15px;
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
    background: #000;
    width: 15px;
    height: 64px;
    display: none;
    &.closed {
      background-position: 0 -132px;
      &:hover {
        background-position: 0 -198px
      }
    }
    &.opened {
      background-position: 0 0;
      &:hover {
        background-position: 0 -67px
      }
    }
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

  div.tab-content .tab-panel {
    position: relative
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

  .table-group #tr-head .serial {
    padding-left: 13px
  }

  .table-group {
    width: 100%;
    white-space: nowrap;
    .wrap {
      width: 52px;
      display: inline-block;
      margin-right: 13px
    }
    .table-head td {
      background-color: #f8f8f8
    }
  }

  #tr-head td span {
    cursor: pointer;
    padding: 3px;
    position: relative
  }

  #tr-head td span .jmenu {
    display: none
  }

  #tr-head td span.spanselected .jmenu {
    display: block
  }

  #tr-head td span b {
    font-weight: 400;
    max-width: 130px;
    overflow: hidden;
    height: 16px;
    line-height: 16px;
    white-space: nowrap;
    text-overflow: ellipsis
  }

  #tr-head td > span:after, #tr-head td span b {
    display: inline-block;
    vertical-align: middle
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

  .table-group td.error {
    background-color: #fbcece
  }

  .table-group td {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #eee;
    padding-left: 6px;
    border-right: 1px solid #eee
  }

  .table-group .item-createTime, .table-group .item-updateTime {
    padding-right: 15px
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

  #data-panel {
    height: 350px;
    position: relative;
    border-top: 1px solid #ddd;
    display: none;
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
  }

  .error-panel #error-current, .error-panel #error-total {
    color: red;
  }
  .alarm-badge {
    background-color: #ed5565 !important;
    color: #fff !important;
  }

  .map-filter,
  .map-message {
    display: inline-block;
    vertical-align: middle;
  }

  .map-message {
    margin-left: 10px;
  }

  .map-footer {
    background-color: #061b32;
    .dropdown-menu {
      height: 470px;
      overflow-y: auto;
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

  .amap-info-content {
    background: rgba(47, 55, 71, .8) !important;
  }

  .info {
    color: #333;
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

  #data-panel {
    overflow-x: scroll !important;
    height: 500px;
  }

  tr.list-group-item {
    padding: 0;
    border: 1px;
  }

  .table-group td {
    padding: 0 6px;
  }

  .table-group .table-head th {
    background-color: #f8f8f8;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #eee;
    padding: 0 6px;
    border-right: 1px solid #eee;
    font-weight: 400;
  }

  .table-group tbody tr:hover,
  .table-group tbody tr.selected {
    background: rgba(0, 145, 255, .05);
    cursor: pointer;
  }

  .table-group tbody tr.selected {
    color: #0091ff;
  }

  .table-group tbody tr.offline {
    color: #aaaaaa;
  }

  .amap-ui-district-cluster-marker {
    border: 1px solid #8e8e8e;
    width: auto;
    height: 22px;
    border-radius: 5px;
    left: 0;
    top: 0;
  }

  .amap-ui-district-cluster-container .overlay-title,
  .amap-ui-district-cluster-marker {
    color: #555;
    background-color: #fffeef;
    font-size: 12px;
    white-space: nowrap;
    position: absolute;
  }

  .amap-ui-district-cluster-marker:after,
  .amap-ui-district-cluster-marker:before {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    border: solid rgba(0, 0, 0, 0);
    border-width: 6px;
    left: 13px;
  }

  .amap-ui-district-cluster-marker:before {
    bottom: -13px;
    border-top-color: #8e8e8e;
  }

  .amap-ui-district-cluster-marker span {
    vertical-align: middle;
    padding: 3px 5px;
    display: inline-block;
    height: 20px;
    line-height: 14px;
  }

  .amap-ui-district-cluster-marker-title {
    border-radius: 5px 0 0 0;
  }

  .amap-ui-district-cluster-marker-body {
    background-color: #dc3912;
    color: #fff;
    border-radius: 0 5px 5px 0;
  }

  .amap-ui-district-cluster-marker-body.success {
    background-color: #28a745;
  }

  .amap-ui-district-cluster-marker.level_district .amap-ui-district-cluster-marker-body {
    background-color: #d47;
  }

  .amap-ui-district-cluster-marker:after {
    bottom: -12px;
    border-top-color: #fffeef;
  }
</style>
