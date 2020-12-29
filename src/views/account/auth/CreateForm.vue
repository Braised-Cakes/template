<template>
    <a-modal
        title="新建任务"
        :width="640"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item
                    label="描述"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-input v-decorator="['desc', {rules: [{required: true, min: 1, message: '请输入至少五个字符的规则描述！'}]}]" />
                </a-form-item>
                <a-form-item
                    label="crontab"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-input v-decorator="['crontab', {rules: [{required: true, min: 1, message: 'crontab表达式'}]}]" />
                </a-form-item>
                <a-form-item
                    label="执行参数"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-input v-decorator="['extParams', {rules: [{required: true, min: 1, message: '执行参数'}]}]" />
                </a-form-item>
                <a-form-item
                    label="优先级"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-input-number v-decorator="['priority', {rules: [{required: true}]}]" style="width: 100%"/>
                </a-form-item>
                <a-form-item
                    label="任务执行超时时间"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-input v-decorator="['execTimeout', {rules: []}]" />
                </a-form-item>
                <a-form-item
                    label="任务描述"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-textarea
                        :rows="4"
                        v-decorator="['info', {info: [{required: true}]}]"
                    ></a-textarea>
                </a-form-item>
                <a-form-item
                    label="是否可复制"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-input v-decorator="['canDuplicate', {rules: [{required: true, min: 1, message: '是否可复制'}]}]" />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
import { addCrontabJob } from '@/api/crontabJob';

export default {
    data() {
        return {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 13 }
            },
            visible: false,
            confirmLoading: false,

            form: this.$form.createForm(this)
        };
    },
    methods: {
        add() {
            this.visible = true;
        },
        handleSubmit() {
            const {
                form: { validateFields }
            } = this;
            this.confirmLoading = true;
            validateFields((errors, values) => {
                if (!errors) {
                    setTimeout(() => {
                        this.visible = false;
                        this.confirmLoading = false;
                        this.$emit('ok', values);
                    }, 1500);
                    console.log('handleAdd values', values);
                    addCrontabJob(values).then(res => {
                            this.$refs.mainTable.refresh();
                            this.$message.info('添加成功');
                    });
                } else {
                    this.confirmLoading = false;
                }
            });
        },
        handleCancel() {
            this.visible = false;
        }
    }
};
</script>
