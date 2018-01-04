<template>
  <div class="ibox float-e-margins animated fadeIn">
    <div class="ibox-title">
      <h5>用户设置</h5>
    </div>
    <div class="ibox-content">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-lg-2 control-label">账号</label>
          <div class="col-lg-10">
            <input type="text" placeholder="账号" class="form-control" disabled="disabled" value="">
          </div>
        </div>
        <div class="form-group"><label class="col-lg-2 control-label">用户名</label>

          <div class="col-lg-10">
            <input type="text" placeholder="用户名" class="form-control" disabled="disabled" value="">
          </div>
        </div>
        <div class="form-group">
          <label class="col-lg-2 control-label">密码</label>
          <div class="col-lg-10">
            <input type="password" id='form_pwd' name="pwd" placeholder="Password" class="form-control" value="">
          </div>
        </div>
        <div class="form-group">
          <label class="col-lg-2 control-label">联系电话</label>
          <div class="col-lg-10">
            <input type="text" id='form_phone' name="phone" placeholder="联系电话" class="form-control" value="">
          </div>
        </div>
        <div class="form-group">
          <label class="col-lg-2 control-label">传真</label>
          <div class="col-lg-10">
            <input type="text" id='form_fox' name="fox" placeholder="传真" class="form-control" value="">
          </div>
        </div>
        <div class="form-group">
          <label class="col-lg-2 control-label">角色</label>
          <div class="col-lg-10">
            <input type="text" placeholder="角色" class="form-control" value="" disabled>
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
</template>

<script>
  export default {
    data: function () {
    }
  }
</script>

<style scoped>

</style>
