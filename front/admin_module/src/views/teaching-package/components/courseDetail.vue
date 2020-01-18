<template>
  <div class="courseDetail">
    <el-form ref="form" :model="courseForm" :rules="courseRule" label-width="110px" style="width: 600px">
      <el-form-item label="课程缩略图" prop="thumb">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="课程名称" prop="title">
        <el-input v-model="courseForm.title" />
      </el-form-item>
      <el-form-item label="课程分类" prop="cate">
        <el-select v-model="courseForm.cate" placeholder="请选择课程分类">
          <el-option label="初级会计" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="适用层次" prop="cengCi">
        <el-select v-model="courseForm.cengCi" placeholder="请选择适用层次">
          <el-option label="中职" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程备注" prop="remark">
        <el-input v-model="courseForm.remark" type="textarea" />
      </el-form-item>
      <el-form-item label="连载状态" prop="state">
        <el-radio-group v-model="courseForm.state">
          <el-radio :label="0">连载中</el-radio>
          <el-radio :label="1">连载结束</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CourseDetail',
  data() {
    return {
      courseForm: {
        thumb: '',
        title: '',
        cate: '',
        cengCi: '',
        remark: '',
        state: 0
      },
      courseRule: {
        title: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        cate: [{ required: true, message: '请选择课程分类', trigger: 'change' }],
        cengCi: [{ required: true, message: '请选择适用层次', trigger: 'change' }],
        state: [{ required: true, message: '请选择连载状态', trigger: 'change' }]
      },
      imageUrl: ''
    }
  },
  methods: {
    onSubmit() {},
    // 上传成功之后
    handleUploadSuccess() {},
    // 上传之前
    beforeUpload() {}
  }
}
</script>

<style>
  .courseDetail .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /*.courseDetail .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }*/
  .courseDetail .avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 150px;
    height: 90px;
    line-height: 90px;
    text-align: center;
  }
  .courseDetail .avatar {
    width: 150px;
    height: 90px;
    display: block;
  }
</style>
<style scoped lang="scss">
  .courseDetail {}
</style>
