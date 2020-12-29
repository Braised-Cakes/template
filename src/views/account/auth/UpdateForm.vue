<template>
    <a-modal
        title="修改任务"
        :width="640"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-steps
                :current="currentStep"
                :style="{ marginBottom: '28px' }"
                size="small"
            >
                <a-step title="基本信息" />
                <a-step title="配置规则属性" />
            </a-steps>
            <a-form :form="form">
                <!-- step1 -->
                <div v-show="currentStep === 0">
                    <a-form-item
                        label="任务id"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                    >
                        <a-input :placeholder="record.id" />
                    </a-form-item>
                     <a-form-item
                        label="crontab"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                    >
                        <a-input v-model.trim="record.crontab" />
                    </a-form-item>
                    <a-form-item
                        label="执行参数"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                    >
                        <a-input v-model.trim="record.extParams" />
                    </a-form-item>
                    <a-form-item
                        label="优先级"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                    >
                        <a-input v-model.trim="record.priority" />
                    </a-form-item>
                    <a-form-item
                        label="任务执行超时时间"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                    >
                        <a-input v-model.trim="record.execTimeout" />
                    </a-form-item>
                    <a-form-item
                        label="任务描述"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                    >
                        <a-textarea
                            :rows="4"
                            v-model.trim="record.info"
                        ></a-textarea>
                    </a-form-item>
                </div>
                <div v-show="currentStep === 1">
                    <a-form-item
                        label="是否可以复制"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                    >
                        <a-select
                            v-decorator="['template', { initialValue: 0, rules: [{required: true}]}]"
                            style="width: 100%"
                        >
                            <a-select-option :value="0">不可复制</a-select-option>
                            <a-select-option :value="1">可复制</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item
                        label="立即运行"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                    >
                        <a-radio-group
                            v-decorator="['type', {initialValue: 0, rules: [{required: true}]}]"
                            style="width: 100%"
                        >
                            <a-radio :value="0">否</a-radio>
                            <a-radio :value="1">是</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </div>
                <!-- step1 end -->
            </a-form>
        </a-spin>
        <template slot="footer">
            <a-button
                key="back"
                @click="backward"
                v-if="currentStep > 0"
                :style="{ float: 'left' }"
            >上一步</a-button>
            <a-button
                key="cancel"
                @click="handleCancel"
            >取消</a-button>
            <a-button
                key="forward"
                :loading="confirmLoading"
                type="primary"
                @click="handleNext(currentStep)"
            >{{ currentStep === 1 && '完成' || '下一步' }}</a-button>
        </template>
    </a-modal>
</template>

<script>
import pick from 'lodash.pick';
import { updateCrontabJob } from '@/api/crontabJob';

const stepForms = [
    ['name', 'desc'],
    ['target', 'template', 'type'],
    ['time', 'frequency']
];

export default {
    name: 'UpdateForm',
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
            record: { id: '1111' },
            confirmLoading: false,
            currentStep: 0,
            mdl: {},
            // 加载数据方法 必须为 Promise 对象
            loadData: this.singleData,
            form: this.$form.createForm(this)
        };
    },
    methods: {
        edit(record) {
            this.$set(this, 'record', record);
            this.visible = true;
            const {
                form: { setFieldsValue }
            } = this;
            this.$nextTick(() => {
                setFieldsValue(pick(record, record));
            });
        },
        handleNext(step) {
            const {
                form: { validateFields }
            } = this;
            const currentStep = step + 1;
            if (currentStep <= 1) {
                // stepForms
                validateFields(stepForms[this.currentStep], (errors, values) => {
                    if (!errors) {
                        this.currentStep = currentStep;
                    }
                });
                return;
            }
            // last step
            this.confirmLoading = true;
            validateFields((errors, values) => {
                console.log('errors:', errors, 'val:', values);
                if (!errors) {
                    setTimeout(() => {
                        this.confirmLoading = false;
                        this.$emit('ok', values);
                    }, 1500);
                    console.log('values begin:', this.record);
                    updateCrontabJob(this.record).then(res => {
                            console.log('values修改成功:', '修改成功');
                            this.$message.info('修改成功');
                            this.visible = false;
                    });
                } else {
                    this.confirmLoading = false;
                    this.visible = false;
                }
            });
        },
        backward() {
            this.currentStep--;
        },
        handleCancel() {
            // clear form & currentStep
            this.visible = false;
            this.currentStep = 0;
        }
    }
};
</script>
