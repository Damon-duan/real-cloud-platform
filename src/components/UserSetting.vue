<template>
  <div class="container-fluid">
    <div class="ibox float-e-margins animated fadeIn">
      <div class="ibox-title">
        <h5>用户设置</h5>
      </div>
      <div class="ibox-content">
        <form class="form-horizontal">
          <div class="form-group"><label class="col-lg-2 control-label">账号</label>

            <div class="col-lg-10">
              <input type="text" placeholder="账号" class="form-control" disabled="disabled"
                     :value="user.mail">
            </div>
          </div>
          <div class="form-group"><label class="col-lg-2 control-label">用户名</label>

            <div class="col-lg-10">
              <input type="text" placeholder="用户名" class="form-control" disabled="disabled"
                     :value="user.name_sn">
            </div>
          </div>
          <div class="form-group"><label class="col-lg-2 control-label">密码</label>

            <div class="col-lg-10">
              <input type="password" id='form_pwd' name="pwd" placeholder="Password" class="form-control" :value="user.pwd">
            </div>
          </div>
          <div class="form-group"><label class="col-lg-2 control-label">联系电话</label>

            <div class="col-lg-10">
              <input type="text" id='form_phone' name="phone" placeholder="联系电话" class="form-control" :value="user.phone">
            </div>
          </div>
          <div class="form-group"><label class="col-lg-2 control-label">传真</label>

            <div class="col-lg-10">
              <input type="text" id='form_fox' name="fox" placeholder="传真" class="form-control" :value="user.fox">
            </div>
          </div>
          <div class="form-group"><label class="col-lg-2 control-label">角色</label>

            <div class="col-lg-10">
              <input type="text" placeholder="角色" class="form-control" :value="getRoleName(user.role)" disabled>
            </div>
          </div>
          <div class="form-group">
            <div class="col-md-1 pull-right">
              <button class="btn btn-sm btn-white" type="button" @click="updateUser()">提交</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import asenConfig from '@/assets/js/asenConfig'
  export default {
    data () {
      return {
        user: {}
      }
    },
    mounted () {
      this.loadUser()
    },
    methods: {
      loadUser () {
        this.$http.get('/getUserSetting').then(result => {
          if (result.data.success) {
            this.user = result.data.data
          }
        })
      },
      updateUser () {
        let pwd = $('#form_pwd').val()
        let phone = $('#form_phone').val()
        let fox = $('#form_fox').val()
        this.$http.post('/setUserSetting', {
          pwd: pwd,
          phone: phone,
          fox: fox
        }).then(function (result) {
          if (result.success) {
            toastr.info('修改成功')
          }
        })
      },
      getRoleName: asenConfig.getRoleName
    }
  }
</script>

<style scoped>

</style>
