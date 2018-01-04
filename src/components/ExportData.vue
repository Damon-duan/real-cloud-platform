<template>
  <div class="ibox float-e-margins animated fadeIn">
    <div class="ibox-title">
      <h5>数据导出</h5>
    </div>
    <div class="ibox-content">
      <form class="form-horizontal">

        <div class="form-group">
          <label class="col-lg-1 control-label">传感器</label>

          <div class="col-lg-11">
            <div class="checkbox checkbox-success checkbox-inline">
              <input type="checkbox" class="sensors" id="" value="" checked>
              <label></label>
            </div>
          </div>
        </div>
        <div class="form-group datepicker-container">
          <label class="col-lg-1 control-label">时间范围</label>

          <div class="col-lg-5">
            <div class="input-daterange input-group" id="datepicker">
              <input type="text" class="input-sm form-control startTime" name="start" />
              <span class="input-group-addon">到</span>
              <input type="text" class="input-sm form-control endTime" name="end" />
            </div>
          </div>
          <div class="col-lg-1 pull-right">
            <button class="btn btn-sm btn-success" type="button">下载</button>
          </div>
        </div>
        <div class="form-group">
          <label class="col-lg-1 control-label">设备</label>

          <div class="col-lg-11">
            <table class="table table-bordered">
              <thead>
              <tr>
                <th>设备id</th>
                <th>名称</th>
                <th>描述</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <th scope="row">
                  <div class="checkbox checkbox-success checkbox-inline">
                    <input type="checkbox" class="devices" value="">
                    <label></label>
                  </div>
                </th>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
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

</style>
