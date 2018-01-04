<template>
  <div id="app">
    <nav class="navbar top-navigation" role="navigation">
      <ul class="nav navbar-top-links navbar-left">
        <li>
          <router-link :to="{ path: '/', activeClass: 'active' }">
            <i class="fa fa-map-marker"></i>
            <span class="nav-label">实时监测</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/realTimeData', activeClass: 'active' }">
            <i class="fa fa-bar-chart-o"></i>
            <span class="nav-label">实时数据</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/rank', activeClass: 'active' }">
            <i class="fa fa-sort-amount-desc"></i>
            <span class="nav-label">排行榜</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/alarm', activeClass: 'active' }">
            <i class="fa fa-bell"></i>
            <span class="nav-label">告警</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/exportData', activeClass: 'active' }">
            <i class="fa fa-cloud-download"></i>
            <span class="nav-label">数据导出</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/devices', activeClass: 'active' }">
            <i class="fa fa-sitemap"></i>
            <span class="nav-label">设备管理</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/userManager', activeClass: 'active' }">
            <i class="fa fa-users"></i>
            <span class="nav-label">用户管理</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/userSetting', activeClass: 'active' }">
            <i class="fa fa-user"></i>
            <span class="nav-label">用户中心</span>
          </router-link>
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
    <router-view></router-view>
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
  color: #9fbad6;
}
.navbar {
  position: fixed;
  width: 100%;
  border-bottom: 1px solid #ddd;
  background-color: #061b32;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
  z-index: 10;
}
</style>
