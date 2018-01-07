const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random
// 设备数据
const devices = {
  'code': 1,
  'data': [
    {
      'active_ind': null,
      'address': '\u5965\u65af\u6069',
      'contractor': '',
      'create_dtm': '2017-05-31 10:45:40',
      'creator': 1,
      'description': '\u5965\u65af\u6069',
      'device_id': '2017053100100001',
      'install_dt': null,
      'lat': '22.697695',
      'lng': '113.83269',
      'name_ln': null,
      'name_sn': '\u5965\u65af\u6069\u4e00\u697c \u5927\u95e8\u6837\u673a',
      'online_ind': 0,
      'type': null,
      'update_dtm': '2018-01-02 00:52:49',
      'user_id': 356
    },
    {
      'active_ind': null,
      'address': '\u4e34\u6f7c\u533a\u51e4\u51f0\u5927\u9053\u82b7\u9633\u4e94\u8def\u4ea4\u53c9\u53e3',
      'contractor': '\u4e2d\u94c1\u4e8c\u5c40\u5de5\u7a0b\u6709\u9650\u516c\u53f8',
      'create_dtm': '2017-10-28 19:06:01',
      'creator': 1,
      'description': '',
      'device_id': '2017102600100015',
      'install_dt': 'Sun, 10 Dec 2017 00:00:00 GMT',
      'lat': '34.393355',
      'lng': '109.170497',
      'name_ln': null,
      'name_sn': '\u897f\u5b89\u4e34\u6f7c\u533a\u5730\u94c19\u53f7\u7ebf\u5de5\u7a0bTJSG7\u68071',
      'online_ind': 1,
      'type': null,
      'update_dtm': '2018-01-07 20:33:37',
      'user_id': 356
    },
    {
      'active_ind': null,
      'address': '\u5965\u65af\u6069\u51c0\u5316\u6280\u672f\u6709\u9650\u516c\u53f8',
      'contractor': '\u897f\u5b89\u9884\u9632\u6d4b\u8bd5',
      'create_dtm': '2017-11-13 11:04:27',
      'creator': 1,
      'description': '\u897f\u5b89\u9884\u9632\u6d4b\u8bd5',
      'device_id': '2017102600100058',
      'install_dt': null,
      'lat': '22.697812',
      'lng': '113.832779',
      'name_ln': null,
      'name_sn': '\u897f\u5b89\u9884\u9632\u6d4b\u8bd5',
      'online_ind': 1,
      'type': null,
      'update_dtm': '2018-01-07 20:33:26',
      'user_id': 356
    }
  ],
  'success': true
}

// 标记点事件数据
const rt = {
  'code': 1,
  'data': {
    'device': {
      'id': '2017102600100058',
      'isOnline': 1,
      'name': '\u897f\u5b89\u9884\u9632\u6d4b\u8bd5'
    },
    'rt_data': {
      'CH2O': -1000.0,
      'CO': -1000.0,
      'CO2': -1000.0,
      'H2S': -1000.0,
      'NH3': -1000.0,
      'NO2': -1000.0,
      'O2': -1000.0,
      'O3': -1000.0,
      'SO2': -1000.0,
      'VOC': -1000.0,
      'datetime': '2018-01-07 22:17:14',
      'device_id': '2017102600100058',
      'humidity': 69.5,
      'illum': -1000.0,
      'negoxygen': -1000.0,
      'noise': 71.4,
      'p10': 6.0,
      'p25': 2.0,
      'pressure': -1000.0,
      'radiation': -1000.0,
      'rainfall': -1000.0,
      'temp': 21.1,
      'tsp': -1000.0,
      'winddirection': '0',
      'windspeed': 1.0
    }
  },
  'success': true
}

Mock.mock('/user/devices', /post|get/i, devices) // 当post或get请求到/news路由时Mock会拦截请求并返回上面的数据
Mock.mock('/data/rt', /post|get/i, rt) // 当post或get请求到/news路由时Mock会拦截请求并返回上面的数据
