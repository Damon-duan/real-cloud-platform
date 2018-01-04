var config = require('../config')

let allSensors = [
  {
    name: 'PM2.5',
    id: 'p25',
    unit: 'ug/m3',
    icon: 'icon-pm25'
  },
  {
    name: 'PM10',
    id: 'p10',
    unit: 'ug/m3',
    icon: 'icon-pm25'
  },
  {
    name: 'tsp',
    id: 'tsp',
    unit: 'ug/m3',
    icon: 'icon-fuchen'
  },
  {
    name: '噪音',
    id: 'noise',
    unit: 'db',
    icon: 'icon-zaoyin'
  },
  {
    name: '风速',
    id: 'windspeed',
    unit: 'm/s',
    icon: 'icon-fengsu'
  },
  {
    name: '风向',
    id: 'winddirection',
    unit: '',
    icon: 'icon-fengxiang'
  },
  {
    name: '温度',
    id: 'temp',
    unit: '℃',
    icon: 'icon-wendu'
  },
  {
    name: '湿度',
    id: 'humidity',
    unit: '%',
    icon: 'icon-shidu'
  },
  {
    name: '气压',
    id: 'pressure',
    unit: 'kPa',
    icon: 'icon-qiyaji'
  },
  {
    name: '总辐射',
    id: 'radiation',
    unit: 'W/m2',
    icon: 'icon-jiawan'
  },
  {
    name: '光照强度',
    id: 'illum',
    unit: 'lux',
    icon: 'icon-guangzhao'
  },
  {
    name: '雨量',
    id: 'rainfall',
    unit: 'mm',
    icon: 'icon-jiangyuliang'
  },
  {
    name: '氧气',
    id: 'O2',
    unit: '%',
    icon: 'icon-jiawan'
  },
  {
    name: '负氧离子',
    id: 'negoxygen',
    unit: '个/cm3',
    icon: 'icon-caozuofulizi'
  },
  {
    name: '硫化氢',
    id: 'H2S',
    unit: 'PPM',
    icon: 'icon-jiawan'
  },
  {
    name: '氨气',
    id: 'NH3',
    unit: 'PPM',
    icon: 'icon-jiawan'
  },
  {
    name: '二氧化硫',
    id: 'SO2',
    unit: 'PPM',
    icon: 'icon-jiawan'
  },
  {
    name: '二氧化氮',
    id: 'NO2',
    unit: 'PPM',
    icon: 'icon-jiawan'
  },
  {
    name: '臭氧',
    id: 'O3',
    unit: 'PPM',
    icon: 'icon-hekricon40'
  },
  {
    name: '一氧化碳',
    id: 'CO',
    unit: 'PPM',
    icon: 'icon-jiawan'
  },
  {
    name: '二氧化碳',
    id: 'CO2',
    unit: 'PPM',
    icon: 'icon-jiawan'
  },
  {
    name: '甲醛',
    id: 'CH2O',
    unit: 'PPM',
    icon: 'icon-jiawan'
  },
  {
    name: 'VOC',
    id: 'VOC',
    unit: 'PPM',
    icon: 'icon-jiawan'
  }
]

let alarmTypes = [
  {type: 'P', name: '电源故障'},
  {type: 'F', name: '排放源停运'},
  {type: 'C', name: '校验'},
  {type: 'M', name: '维护'},
  {type: 'T', name: '超测上限'},
  {type: 'D', name: '故障'},
  {type: 'S', name: '设定值'},
  {type: 'N', name: '正常'},
  {type: '0', name: '校准数据'},
  {type: '1', name: '气象参数'},
  {type: '2', name: '异常数据'},
  {type: '3', name: '正常数据'}
]

let sensorsMap = {}
allSensors.map(item => {
  sensorsMap[item.id] = item
})
export default {
  allSensors,
  alarmTypes,
  serverHost: process.env.NODE_ENV === 'development' ? config.dev.env.serverHost : config.build.env.serverHost,
  map_web_api_key: '1ac7ac8167b543865110879b974966b6',
  getSensorName: function (id) {
    if (!sensorsMap[id]) {
      return ''
    }
    return sensorsMap[id].name
  },
  getUnit: function (id) {
    if (!sensorsMap[id]) {
      return ''
    }
    return sensorsMap[id].unit
  },
  getStandard: function (name) {
    switch (name) {
      case 'noise':
        return 65
      case 'p25':
        return 75
      default:
        return ''
    }
  },
  getAlarmText: function (type) {
    if (type + '' === 'null' || typeof type === 'undefined') {
      return ''
    }
    let result = alarmTypes.find((alarm) => {
      return alarm.type === type + ''
    })
    return result ? result.name : ''
  },
  getDisplayValue: function (val, sensor) {
    if (typeof val === typeof undefined || val === -1000 || val === '' || val === null) {
      return '无数据'
    }
    if (sensor === 'winddirection') {
      val = parseInt(val)
      if (isNaN(val)) {
        return '数据不正确'
      }
      switch (val) {
        case 0:
          return '东北偏北'
        case 1:
          return '东北'
        case 2:
          return '东北偏东'
        case 3:
          return '正东'
        case 4:
          return '东南偏东'
        case 5:
          return '东南'
        case 6:
          return '东南偏南'
        case 7:
          return '正南'
        case 8:
          return '西南偏南'
        case 9:
          return '西南'
        case 10:
          return '西南偏西'
        case 11:
          return '正西'
        case 12:
          return '西北偏西'
        case 13:
          return '西北'
        case 14:
          return '西北偏北'
        case 15:
          return '正北'
        default:
          return '无数据'
      }
    }
    return val
  },
  sensorChartType: function (sensor) {
    switch (sensor) {
      case 'rainfall':
      case 'p25':
      case 'p10':
        return 'area'
      default:
        return ''
    }
  },
  getRoleName: function (role) {
    role = '' + role
    switch (role) {
      case '10':
        return '管理员'
      case '20':
        return '代理商'
      case '30':
        return '终端用户'
      default:
        return '未知'
    }
  },
  getAllSensors: function () {
    return allSensors.map((sensor) => {
      return {id: sensor.id, name: sensor.name}
    })
  }
}
