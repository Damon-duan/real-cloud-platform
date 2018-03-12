<template>
  <div class="login-wrapper">
    <div class="sky">
      <div class="clouds_one"></div>
      <div class="clouds_two"></div>
      <div class="clouds_three"></div>
    </div>
    <div class="loginColumns animated fadeInDown">
      <div class="row">
        <div class="col-md-12">
          <div class="ibox-content">
            <h2 class="ibox-label">扬尘污染实时监控系统</h2>
            <form class="clearfix" role="form" action="" method="post">
              <div class="form-group">
                <div class="input-group">
                <span class="input-group-addon">
                  <i class="fa fa-user" aria-hidden="true"></i>
                </span>
                  <input type="text" class="form-control" placeholder="帐号" required name="mail">
                </div>
              </div>
              <div class="form-group">
                <div class="input-group">
                <span class="input-group-addon">
                  <i class="fa fa-lock" aria-hidden="true"></i>
                </span>
                  <input type="password" class="form-control" placeholder="密码" required name="pwd">
                </div>
              </div>
              <button type="submit" class="btn btn-white block pull-right">登录</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <p class="copyright">
        <a href="http://www.miitbeian.gov.cn" target="_blank" style="color: white;">粤ICP备13004430号-13</a>
      </p>
    </footer>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .login-wrapper {
    background-color: #8bb3d5;
  }
  .sky {
    margin-top: 23%;
    width: 100%;
    height: 480px;
    position: absolute;
    overflow: hidden;
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    &-bg {
      overflow: hidden;
    }
  }

  .clouds {
    &_one {
      background: url("../../static/images/cloud_one.png");
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 300%;
      -webkit-animation: cloud_one 100s linear infinite;
      -moz-animation: cloud_one 100s linear infinite;
      -o-animation: cloud_one 100s linear infinite;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      -o-transform: translate3d(0, 0, 0)
    }
    &_two {
      background: url("../../static/images/cloud_two.png");
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 300%;
      -webkit-animation: cloud_two 150s linear infinite;
      -moz-animation: cloud_two 150s linear infinite;
      -o-animation: cloud_two 150s linear infinite;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      -o-transform: translate3d(0, 0, 0)
    }

    &_three {
      background: url("../../static/images/cloud_three.png");
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 300%;
      -webkit-animation: cloud_three 200s linear infinite;
      -moz-animation: cloud_three 200s linear infinite;
      -o-animation: cloud_three 200s linear infinite;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      -o-transform: translate3d(0, 0, 0)
    }
  }

  @-webkit-keyframes cloud_one {
    0% {
      left: 0
    }
    100% {
      left: -200%
    }
  }

  @-webkit-keyframes cloud_two {
    0% {
      left: 0
    }
    100% {
      left: -200%
    }
  }

  @-webkit-keyframes cloud_three {
    0% {
      left: 0
    }
    100% {
      left: -200%
    }
  }

  @-moz-keyframes cloud_one {
    0% {
      left: 0
    }
    100% {
      left: -200%
    }
  }

  @-moz-keyframes cloud_two {
    0% {
      left: 0
    }
    100% {
      left: -200%
    }
  }

  @-moz-keyframes cloud_three {
    0% {
      left: 0
    }
    100% {
      left: -200%
    }
  }

  .loginColumns {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 880px;
    height: 250px;
  }

  .ibox {
    &-content {
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 3px;
      margin: 0 auto;
      width: 50%;
    }
    &-label {
      color: #000000;
      margin-bottom: 25px;
    }
  }

  .copyright {
    position: fixed;
    bottom: 0;
    color: white;
    margin-left: 50%;
    transform: translate(-50%, 0);
  }
</style>
