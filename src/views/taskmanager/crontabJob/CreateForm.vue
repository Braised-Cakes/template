<template>
    <a-modal
        :title="pageType == 'add' ? '新建任务' : '编辑任务id:' + myform.id"
        :width="640"
        :bodyStyle="{'overflow':'auto', 'height': '300px'}"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            {{ data }}
            <my-form
                :descriptors="descriptors"
                :data="data"
            >
            </my-form>
            <!-- <a-form-model
                ref="ruleForm"
                :model="myform"
                :rules="rules"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
            >
                <a-form-model-item
                    label="任务名"
                    prop="info"
                    htmlFor="info"
                >
                    <a-input v-model="myform.info" />
                </a-form-model-item>
                <a-form-model-item
                    label="crontab"
                    prop="crontab"
                    htmlFor="crontab"
                >
                    <a-input v-model="myform.crontab" />
                </a-form-model-item>
                <a-form-model-item
                    label="执行参数"
                    prop="extParams"
                    htmlFor="extParams"
                >
                    <a-input v-model="myform.extParams" />
                </a-form-model-item>
                <a-form-model-item
                    label="优先级"
                    prop="priority"
                    htmlFor="priority"
                >
                    <a-input-number v-model="myform.priority" />
                </a-form-model-item>
                <a-form-model-item
                    label="任务执行超时时间任务执行超时时间"
                    prop="execTimeout"
                    htmlFor="execTimeout"
                >
                    <a-input v-model="myform.execTimeout" />
                </a-form-model-item>
                <a-form-model-item
                    label="是否可以复制"
                    prop="canDuplicate"
                    htmlFor="canDuplicate"
                >
                    <a-select v-model="myform.canDuplicate">
                        <a-select-option :value="0">不可复制</a-select-option>
                        <a-select-option :value="1">可复制</a-select-option>
                    </a-select>
                </a-form-model-item>
            </a-form-model> -->
        </a-spin>
    </a-modal>
</template>

<script>
import { axios } from '@/utils/request'
import { scrollIntoView } from '@/utils/util'
import _ from 'lodash'
import parser from 'cron-parser'
import { MyForm } from '@/mycomponents/index'

/**
    type: input|select
 */
export default {
    components: {
        MyForm,
    },
    data() {
        return {
            createParam: {},
            data: {},
            descriptors: {
                info: {
                    label: '任务名',
                    prop: 'info',
                    type: 'input',
                    disabled(row) {
                        return row.info === 2
                    },
                    placeholder: '请输入任务名',
                    prefix: <a-icon slot="prefix" type="user" />,
                    suffix: (
                        <a-tooltip slot="suffix" title="Extra information">
                            <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
                        </a-tooltip>
                    ),
                    value: '222',
                    rules: [
                        { required: true, message: '请输入至少一个字符的描述！' },
                        {
                            type: 'url',
                        },
                        {
                            max: 5,
                            message: '啦啦啦',
                            trigger: 'change',
                        },
                    ],
                },
                canDuplicate: {
                    label: '是否可以复制',
                    prop: 'canDuplicate',
                    type: 'select',
                    value: '0',
                    option: [
                        {
                            label: '不可复制',
                            value: '0',
                        },
                        {
                            label: '可复制',
                            value: '1',
                        },
                    ],
                    change: 'function(row){console.log(row)}',
                    // change(newVal, oldVal, row, descriptors) {
                    //     console.log(newVal, oldVal, row, descriptors)
                    //     row.aaa = '1'
                    //     descriptors['aaa'].option = [
                    //         {
                    //             label: '我不好',
                    //             value: '0',
                    //         },
                    //         {
                    //             label: '你好111',
                    //             value: '1',
                    //         },
                    //     ]
                    // },
                },
                aaa: {
                    label: '你好啊',
                    prop: 'aaa',
                    type: 'select',
                    value: '',
                    option: [
                        {
                            label: '我不好',
                            value: '0',
                        },
                        {
                            label: '你好',
                            value: '1',
                        },
                    ],
                    // disabled(row) {
                    //     return row.info === '222'
                    // },
                    show(row) {
                        console.log(row)
                        return true
                        // return row.canDuplicate === '1'
                    },
                },
            },
            // data: [
            //     {
            //         label: '任务名',
            //         prop: 'info',
            //         type: 'input',
            //         value: '',
            //         rules: [{ required: true, message: '请输入至少一个字符的描述！' }]
            //     },
            //     {
            //         label: '是否可以复制',
            //         prop: 'canDuplicate',
            //         type: 'select',
            //         value: '0',
            //         option: [
            //             {
            //                 label: '不可复制',
            //                 value: '0'
            //             },
            //             {
            //                 label: '可复制',
            //                 value: '1'
            //             }
            //         ],
            //         change(newVal, oldVal, row) {
            //             console.log(newVal, oldVal, row)
            //             row.aaa = 222
            //         }
            //     },
            //     {
            //         label: '你好啊',
            //         prop: 'aaa',
            //         type: 'input',
            //         value: '',
            //         show(row) {
            //             console.log(row)
            //             return row.canDuplicate === '1'
            //         }
            //     }
            // ],
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 13 },
            },
            visible: false,
            confirmLoading: false,
            defaultForm: {
                info: '',
                crontab: '',
                extParams: '',
                priority: '',
                execTimeout: '',
                canDuplicate: 0,
            },
            myform: {},
            pageType: 'add',
            allProducts: {},
            rules: {
                info: [{ required: true, message: '请输入至少一个字符的描述！' }],
                crontab: [
                    {
                        required: true,
                        message: 'crontab必填',
                    },
                    {
                        validator: (rule, value, callback) => {
                            try {
                                const interval = parser.parseExpression(value)
                                console.log('cronDate:', interval.next().toDate())
                                callback()
                            } catch (e) {
                                callback(new Error('非Cron表达式格式，请检查！'))
                            }
                        },
                    },
                ],
                extParams: [{ required: true, min: 1, message: '执行参数' }],
                priority: [{ required: true }],
                execTimeout: [],
                canDuplicate: [{ required: true }],
            },
        }
    },
    created() {},
    methods: {
        add() {
            this.visible = true
            this.pageType = 'add'
            this.myform = _.cloneDeep(this.defaultForm)
            this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        },
        edit(row) {
            this.visible = true
            this.pageType = 'edit'
            this.myform = _.cloneDeep(row)
            this.$refs.rulesForm && this.$refs.ruleForm.clearValidate()
        },
        handleSubmit() {
            // console.log('begin handleSubmit')
            this.$refs.ruleForm.validate((valid, error) => {
                console.log(valid)
                console.log(error)
                if (valid) {
                    this.confirmLoading = true
                    axios({
                        url: 'https://randomuser.me/api',
                        method: 'post',
                        data: this.myform,
                    })
                        .then((res) => {
                            this.$message.info('更新成功')
                            this.visible = false
                            this.$emit('ok')
                        })
                        .finally(() => {
                            this.confirmLoading = false
                        })
                } else {
                    console.log(`label[for="${Object.keys(error)[0]}"]`)
                    scrollIntoView(`label[for="${Object.keys(error)[0]}"]`)
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleCancel() {
            this.visible = false
        },
    },
}
</script>

<style scoped>
</style>
