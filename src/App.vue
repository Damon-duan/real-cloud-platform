<template>
  <div id="app">
    <nav class="navbar top-navigation" role="navigation">
      <ul class="nav navbar-top-links navbar-left">
        <li v-link="{ path: '/map-overview', activeClass: 'active' }">
          <a>
            <i class="fa fa-map-marker"></i>
            <span class="nav-label">实时监测</span>
          </a>
        </li>
        <li v-link="{ path: '/realTimeData', activeClass: 'active' }">
          <a>
            <i class="fa fa-bar-chart-o"></i>
            <span class="nav-label">实时数据</span>
          </a>
        </li>
        <li v-link="{ path: '/rank', activeClass: 'active' }">
          <a>
            <i class="fa fa-sort-amount-desc"></i>
            <span class="nav-label">排行榜</span>
          </a>
        </li>
        <li v-link="{ path: '/alarm', activeClass: 'active' }">
          <a>
            <i class="fa fa-bell"></i>
            <span class="nav-label">告警</span>
          </a>
        </li>
        <li v-link="{ path: '/exportData', activeClass: 'active' }">
          <a>
            <i class="fa fa-cloud-download"></i>
            <span class="nav-label">数据导出</span>
          </a>
        </li>
        <li v-link="{ path: '/devices', activeClass: 'active' }">
          <a>
            <i class="fa fa-sitemap"></i>
            <span class="nav-label">设备管理</span>

          </a>
        </li>
        <li v-link="{ path: '/userManager', activeClass: 'active' }">
          <a>
            <i class="fa fa-users"></i>
            <span class="nav-label">用户管理</span>

          </a>
        </li>
        <li v-link="{ path: '/userSetting', activeClass: 'active' }">
          <a>
            <i class="fa fa-user"></i>
            <span class="nav-label">用户中心</span>

          </a>
        </li>
      </ul>
      <ul class="nav navbar-top-links navbar-right">
        <li>
          <span class="m-r-sm text-muted welcome-message">欢迎 XXX 来到实时云监控平台</span>
        </li>
        <li>
          <a href="/logout">
            <i class="fa fa-sign-out"></i> 登出
          </a>
        </li>
      </ul>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: "Microsoft YaHei", "Arial", "SimSun";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.navbar {
  position: fixed;
  width: 100%;
  border-bottom: 1px solid #ddd;
}
</style>
