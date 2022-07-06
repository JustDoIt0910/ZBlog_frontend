<template>
    <div>
        <a-card>        
            <h3>{{id ? "编辑文章":"写 文 章"}}</h3>
            <a-form-model :model="artInfo" :rules="artFormRules" ref="artFormRef">
                <a-form-model-item label="文章标题" prop="title">
                    <a-input style="width: 500px" v-model="artInfo.title" @blur="onTitleChange"></a-input>
                </a-form-model-item>

                <a-form-model-item label="文章分类" prop="cid">
                    <a-select style="width: 200px;" placeholder="请选择分类" v-model="artInfo.cid" @change="onCateChange">
                      <a-select-option v-for="item in catelist" :key="item.id">
                          {{item.name}}
                      </a-select-option>
                    </a-select>
                </a-form-model-item>

                <a-form-model-item label="文章描述">
                    <a-input type="textarea" v-model="artInfo.summary"></a-input>
                </a-form-model-item>

                <a-form-model-item label="文章缩略图">
                    <a-upload
                        name="file"
                        :multiple="false"
                        action="http://localhost:9999/post/upload"
                        :headers="headers"
                        @change="tuploadChange"
                    >
                        <a-button> <a-icon type="upload" />上传文章缩略图</a-button>
                    </a-upload>
                    <template v-if="id">
                        <img :src="artInfo.banner" style="width: 200px; height: 160px;" />
                    </template>
                </a-form-model-item>

                <a-form-model-item label="文章内容图片">
                    <a-upload
                        name="file"
                        :multiple="true"
                        action="http://localhost:9999/post/upload"
                        :headers="headers"
                        @change="iuploadChange"
                    >
                        <a-button> <a-icon type="upload" />上传文章内容图片</a-button>
                    </a-upload>
                    <div class="imgLinks" v-for="(img, index) in uploadImageList" :key = index @click="copyLink">{{img}}</div>
                </a-form-model-item>

                <a-form-model-item label="文章内容" prop="content">
                    <!-- <a-input v-model="artInfo.content"></a-input> -->
                    <mavon-editor v-model="artInfo.content" />
                </a-form-model-item>

                <a-form-model-item>
                    <a-button type="danger" style="margin-right: 20px;" @click="submit(artInfo.id)">提交</a-button>
                    <a-button type="primary" @click="cancel">取消</a-button>
                </a-form-model-item>
            </a-form-model>
        </a-card>
    </div>
</template>

<script>
export default {
    props: ['id'],
    data() {
        return {
            artInfo: {
                id: 0,
                title: "",
                cid: undefined,
                summary: "",
                content: "",
                banner: ""
            },
            catelist: [],
            headers: {},
            artFormRules: {
                title: [{required: true, message: "请输入标题", trigger: "blur"}],
                cid: [{required: true, message: "请选择分类", trigger: "blur"}],
                content: [{required: true, message: "内容不能为空", trigger: "blur"}]
            },
            uploadImageList: []
        }
    },
    methods: {
        copyLink(e) {
            let innerText = e.target.innerText;
            var tmpInput = document.createElement("input");
            document.body.appendChild(tmpInput);
            tmpInput.value = innerText;
            tmpInput.select();
            document.execCommand("copy"); // copy
            tmpInput.remove();
            this.$message.success('成功复制链接')
        },
        async getCateList() {
            const {data: data} = await this.$http.get('category/list')
            if(data.code != 200)
                return this.$message.error(data.message)
            this.catelist = data.data
        },
        async getArticleInfo(id) {
            const {data: data} = await this.$http.get(`post/${id}`)
            if(data.code != 200)
                return this.$message.error(data.message)
            console.log(data.data)
            this.artInfo = data.data
        },
        onCateChange(cid) {
            this.artInfo.cid = cid
        },
        onTitleChange(event) {
            this.headers.title = encodeURIComponent(event.target.value)
        },
        tuploadChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done' && info.file.response.code == 200) {
                this.$message.success(`${info.file.name} 缩略图上传成功`)
                this.artInfo.banner = info.file.response.data
            } else {
                this.$message.error(`${info.file.name} 缩略图上传失败 ${info.file.response.message}`)
            }
        },
        iuploadChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done' && info.file.response.code == 200) {
                this.$message.success(`${info.file.name} 图片上传成功`)
                this.uploadImageList.push(decodeURIComponent(info.file.response.data))
            } else {
                this.$message.error(`${info.file.name} 图片上传失败 ${info.file.response.message}`)
            }
        },
        submit(id) {
            this.$refs.artFormRef.validate(async (valid) => {
                if(valid) {
                    if(id == 0) {
                        const {data: res} = await this.$http.post('/post/add', {
                            title: this.artInfo.title,
                            cid: this.artInfo.cid,
                            summary: this.artInfo.summary,
                            content: this.artInfo.content,
                            banner: this.artInfo.banner
                        })
                        if(res.code != 200) 
                            return this.$message.error("文章添加失败")
                        this.$message.success("文章添加成功")
                        this.$router.push('/admin/articles')
                    }
                    else {
                        const {data: res} = await this.$http.put(`/post/${this.artInfo.id}`, {
                            title: this.artInfo.title,
                            cid: this.artInfo.cid,
                            summary: this.artInfo.summary,
                            content: this.artInfo.content,
                            banner: this.artInfo.banner
                        })
                        if(res.code != 200) 
                            return this.$message.error("文章编辑失败")
                        this.$message.success("文章编辑成功")
                        this.$router.push('/admin/articles')
                    }
                }
                else {
                    return this.$message.error("输入不符合条件")
                }
            })     
        },
        cancel() {
            this.$refs.artFormRef.resetFields()
        }
    },
    created() {
        this.getCateList()
        this.headers = {Authorization: `Bearer ${window.localStorage.getItem('token')}`}
        if(this.id) 
            this.getArticleInfo(this.id)
        else 
        {
            this.artInfo = {
                id: 0,
                title: "",
                cid: undefined,
                summary: "",
                content: "",
                banner: ""
            }
        }
    }
}
</script>

<style scoped>
.imgLinks {
    width: 500px;
    height: 25px;
    overflow: hidden;
    background-color: rgb(244, 246, 250);
    border-radius: 10px;
    margin-top: 10px;
    padding-top: 0;
    padding-left: 10px;
    line-height: 25px;
    cursor: pointer;
}

.imgLinks:hover {
    background-color: rgb(244, 246, 230);
}

</style>