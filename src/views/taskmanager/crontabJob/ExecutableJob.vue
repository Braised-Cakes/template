<template>
    <a-modal
        title="可执行的任务"
        :width="640"
        :bodyStyle="{height:'400px','overflow':'auto'}"
        :visible="visible"
        @cancel="handleCancel"
    >
        <s-table
            ref="mainTable"
            size="default"
            rowKey="row.id"
            :columns="columns"
            :data="loadData"
            showPagination="false"
        >
            <span
                slot="serial"
                slot-scope="text, record, index"
            >
                {{ index + 1 }}
            </span>
            <span
                slot="status"
                slot-scope="text"
            >
                <a-badge
                    :status="text | statusTypeFilter"
                    :text="text | statusFilter"
                />
                <!-- <a-button v-if="text == 0 ">an </a-button> -->
            </span>
            <span
                slot="action"
                slot-scope="text, record"
            >
                <template>
                    <a @click="handleEdit(record)">修改</a>
                    <a-divider type="vertical" />
                    <a @click="handleDelete(record)">删除</a>
                    <a-divider type="vertical" />
                    <a @click="handleStatus(record)">{{ record.status === 1 && '暂停' || '运行' }}</a>
                </template>
            </span>
        </s-table>
    </a-modal>
</template>

<script>
import { axios } from '@/utils/request'
import { STable, Ellipsis } from '@/components'
import CreateForm from './CreateForm'
import dayjs from 'dayjs'
const statusMap = {
    0: {
        status: 'default',
        text: '已暂停'
    },
    1: {
        status: 'processing',
        text: '运行中'
    }
}

export default {
    name: 'ListForm',
    components: {
        STable,
        Ellipsis,
        CreateForm
    },
    data() {
        return {
            visible: false,
            row: {},
            mdl: {},
            executableJobs: {},
            // 所有产品线
            allProducts: {},
            // 表头
            columns: [
                {
                    title: 'id',
                    dataIndex: 'id'
                },
                {
                    title: 'jobId',
                    dataIndex: 'jobId'
                },
                {
                    title: '执行job节点',
                    dataIndex: 'senderIdentity'
                },
                {
                    title: '执行参数',
                    dataIndex: 'extParams',
                    scopedSlots: { customRender: 'extParams' }
                },
                {
                    title: '重试次数',
                    dataIndex: 'retryTimes'
                },
                {
                    title: '已经执行次数',
                    dataIndex: 'doneTimes'
                },
                {
                    title: '优先级',
                    dataIndex: 'priority',
                    scopedSlots: { customRender: 'priority' }
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' }
                },
                {
                    title: '可被处理时间',
                    dataIndex: 'updateTime',
                    // js 操作方式
                    customRender: (text, row) => {
                        return dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
                    },
                    sorter: true
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    // js 操作方式
                    customRender: (text, row) => {
                        return dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
                    },
                    sorter: true
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    width: '150px',
                    scopedSlots: { customRender: 'action' }
                }
            ],
            // 加载数据方法 必须为 Promise 对象
            loadData: parameter => {
                console.log('loadData.parameter', parameter)
                return axios({
                    url: '/executableJob/queryExecutableJob',
                    method: 'get',
                    params: Object.assign(parameter, { cronJobId: this.row.id, productLine: this.row.productLine })
                }).then(res => {
                    return res
                    // this.executableJobs = res.records;
                })
            }
        }
    },
    filters: {
        statusFilter(type) {
            return statusMap[type].text
        },
        statusTypeFilter(type) {
            return statusMap[type].status
        }
    },
    created() {},
    methods: {
        show(record) {
            this.visible = true
            this.row = record
            console.log('record show' + record)
        },
        getAllProducts() {
            axios({
                url: '/uc/product/queryAll',
                method: 'get',
                params: null
            }).then(res => {
                this.allProducts = res.result
            })
        },
        handleCancel() {
            this.visible = false
        }
    }
}
</script>