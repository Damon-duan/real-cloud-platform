import Vue from 'vue'
import Router from 'vue-router'
import LayoutPage from '@/components/LayoutPage'
import MapOverview from '@/components/MapOverview'
import RealTimeData from '@/components/RealTimeData'
import rank from '@/components/rank'
import alarm from '@/components/alarm'
import ExportData from '@/components/ExportData'
import devices from '@/components/devices'
import UserManager from '@/components/UserManager'
import UserSetting from '@/components/UserSetting'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'LayoutPage',
      component: LayoutPage,
      children: [
        {
          name: 'MapOverview',
          path: '/',
          component: MapOverview
        },
        {
          path: '/realTimeData',
          name: 'RealTimeData',
          component: RealTimeData
        },
        {
          path: '/rank',
          name: 'rank',
          component: rank
        },
        {
          path: '/alarm',
          name: 'alarm',
          component: alarm
        },
        {
          path: '/exportData',
          name: 'ExportData',
          component: ExportData
        },
        {
          path: '/devices',
          name: 'devices',
          component: devices
        },
        {
          path: '/userManager',
          name: 'UserManager',
          component: UserManager
        },
        {
          path: '/userSetting',
          name: 'UserSetting',
          component: UserSetting
        }
      ]
    }
  ]
})
