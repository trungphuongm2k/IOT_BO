import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, Checkbox, Form, Popconfirm, Row, Select, Table, Tag } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import ModalWrapper from '../components/common/ModalWrapper';
import MainLayout from '../components/MainLayout';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import FilterWrapper from '../components/common/FilterWrapper';
import ModalBtnSubmit from '../components/common/ModalBtnSubmit';
import ModalInput from '../components/common/ModalInput';
import ModalItemWrapper from '../components/common/ModalItemWrapper';
import TitleSearch from '../components/common/TitleSearch';
import { TableParams, User } from '../interface';
import {
    createUser,
    deleteUser,
    getAllUser,
    getAllUserNotPage,
    getDetailUser,
    updateUser,
} from '../store/slice/userSlice';
import moment from 'moment';

const listRole = ['admin', 'member'];

const UserPage = () => {
    const [namePage, setNamePage] = useState<string>('Tài Khoản ');
    const submitBtn = useRef<any>();
    const { listUser, totalUser, loadingApiUser, listManager } = useAppSelector(
        (state) => state.user
    );
    const dispatch = useAppDispatch();
    const [reload, setReload] = useState<boolean>(false);
    const [isAddOrFix, setIsAddOrFix] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [userforTool, setUserforTool] = useState<boolean>(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30'],
        },
        page: 1,
    });
    const [where, setWhere] = useState<any>({
        isDeleted: false,
    });
    const [form] = Form.useForm();

    useEffect(() => {
        setLoading(true);
        dispatch(
            getAllUser({
                page: tableParams.pagination?.current as number,
                perPage: tableParams.pagination?.pageSize as number,
                where,
            })
        ).then(() => {
            setLoading(false);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, JSON.stringify(tableParams), JSON.stringify(where)]);

    useEffect(() => {
        dispatch(getAllUserNotPage({}));
    }, []);

    const action = () => {
        return {
            handleReLLoad: () => {
                setReload((state) => !state);
            },
            handleAddRecord: () => {
                setIsOpenModal(true);
                setIsAddOrFix(true);
                form.resetFields();
            },
            handleCancelModal: () => {
                setIsOpenModal(false);
                setUserforTool(false);
            },
            handleUpdate: (id: string) => {
                dispatch(getDetailUser(id)).then((afterDispatch: any) => {
                    const role = afterDispatch.payload.role.map((item: any) => item.name);
                    if (afterDispatch.meta.requestStatus === 'fulfilled') {
                        form.resetFields();
                        setIsOpenModal(true);
                        setIsAddOrFix(false);
                        if (afterDispatch.payload?.computerId) {
                            setUserforTool(true);
                        }
                        form.setFieldsValue({
                            id: afterDispatch.payload?.id,
                            username: afterDispatch.payload?.username,
                            email: afterDispatch.payload?.email,
                            lastName: afterDispatch.payload?.lastName,
                            department: afterDispatch.payload?.department,
                            managerId: afterDispatch.payload?.manager?.id,
                            phoneNumber: afterDispatch.payload?.phoneNumber,
                            roleName: role,
                            computerId: afterDispatch.payload?.computerId,
                        });
                    }
                });
            },

            handleCreateUser: (values: any) => {
                dispatch(createUser(values)).then((afterDispatch: any) => {
                    if (afterDispatch.meta.requestStatus !== 'fulfilled') return;
                    action().handleCancelModal();
                    setReload((state) => !state);
                });
            },
            handleUpdateUser: (updateData: any) => {
                delete updateData.username;
                dispatch(updateUser(updateData)).then((afterDispatch: any) => {
                    if (afterDispatch.meta.requestStatus === 'fulfilled') {
                        action().handleCancelModal();
                    }
                });
            },
            handleDelete: (id: string) => {
                dispatch(deleteUser(id));
            },
        };
    };

    const onSubmitForm = async (values: any) => {
        if (isAddOrFix) {
            action().handleCreateUser(values);
        } else {
            const { id } = values;
            action().handleUpdateUser({ id, ...values });
        }
    };

    const onSubmitFormFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setTableParams({
            pagination: { ...pagination },
        });
    };

    const handleUpdateFilter = (value: any) => {
        const { username } = value;
        const newFilter: Record<string, any> = {
            isDeleted: false,
        };

        if (username) newFilter.username = username;
        setWhere(newFilter);
    };

    const columns: ColumnsType<User> = [
        {
            title: '#',
            key: 'count',
            width: 50,
            render: (text: string, record: User, index: number) => {
                return index + 1;
            },
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'action',
            width: 100,
            render: (id: string) => (
                <div key={id} className='flex gap-2'>
                    <Button
                        className='bg-[#1890ff]'
                        type='primary'
                        icon={<EditFilled />}
                        onClick={() => action().handleUpdate(id)}
                    />

                    <Popconfirm
                        placement='top'
                        title='Bạn muốn xóa bản ghi này?'
                        onConfirm={() => action().handleDelete(id)}
                        okText='Yes'
                        okButtonProps={{
                            loading: loadingApiUser,
                        }}
                        cancelText='No'>
                        <Button type='primary' icon={<DeleteFilled />} danger />
                    </Popconfirm>
                </div>
            ),
        },
        {
            title: 'userName',
            dataIndex: 'username',
            width: 'auto',
            render: (name: string) => <span className='font-semibold'>{name}</span>,
        },

        {
            title: 'Quyền',
            dataIndex: 'role',
            width: 'auto',
            render: (_, { role }) => (
                <>
                    {role?.map((role, index) => {
                        let color = index % 2 ? 'geekblue' : 'green';

                        return (
                            <Tag color={color} key={role.id}>
                                {role.name.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },

        {
            title: 'Email',
            dataIndex: 'email',
            width: 'auto',
            render: (email: string) => <span className='text-[#2335ff]'>{email}</span>,
        },
        {
            title: 'Phòng ban',
            dataIndex: 'department',
            width: 'auto',
            render: (department: string) => <span className='text-[#2335ff]'>{department}</span>,
        },
        {
            title: 'SDT',
            dataIndex: 'phoneNumber',
            width: 'auto',
            render: (phoneNumber: string) => (
                <span className='text-[#2335ff]'>{phoneNumber || 'Chưa có dữ liệu'}</span>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 200,
            render: (createdAt: string) => (
                <span className='text-[#2335ff]'>{moment(createdAt).format('L LT')}</span>
            ),
        },
        {
            title: 'Ngày sửa',
            dataIndex: 'updatedAt',
            width: 200,
            render: (updatedAt: string) => (
                <span className='text-[#2335ff]'>{moment(updatedAt).format('L LT')}</span>
            ),
        },
    ];

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const { Option } = Select;
    return (
        <MainLayout
            title={`Quản lý ${namePage}`}
            namePage={namePage}
            reLoadCb={action().handleReLLoad}
            addRecordCb={action().handleAddRecord}
            loading={loadingApiUser}>
            {/* --------------------------------------------Filter--------------------------------------------------- */}
            <FilterWrapper updateFilter={handleUpdateFilter}>
                <TitleSearch label='Tìm theo tên' name='username' placeholder='Nhập vào tên' />
            </FilterWrapper>
            {/* --------------------------------------------Modal--------------------------------------------------- */}

            <ModalWrapper
                title={isAddOrFix ? `Thêm ${namePage} mới` : `Chỉnh sửa ${namePage}`}
                isOpen={isOpenModal}
                onCancel={action().handleCancelModal}
                titleBtn={isAddOrFix ? 'Thêm mới' : 'Sửa'}
                submitBtnRef={submitBtn}
                loadingApi={loadingApiUser}>
                <Form
                    name='basic'
                    form={form}
                    {...layout}
                    layout='vertical'
                    initialValues={{ remember: true }}
                    onFinish={onSubmitForm}
                    onFinishFailed={onSubmitFormFailed}
                    autoComplete='off'>
                    {!isAddOrFix && (
                        <Row gutter={[16, 0]}>
                            {!isAddOrFix && (
                                <ModalInput
                                    layout={{ xs: 24, md: 12 }}
                                    label='Id'
                                    name='id'
                                    required
                                    disabled
                                />
                            )}
                        </Row>
                    )}
                    <Row gutter={[16, 0]}>
                        <ModalInput
                            layout={{ xs: 24, md: 12 }}
                            label='Bộ phận'
                            name='department'
                            required
                        />
                        <ModalItemWrapper
                            layout={{
                                xs: 24,
                                md: 12,
                            }}
                            label='Người quản lý'
                            name='managerId'>
                            <Select
                                maxLength={1}
                                allowClear
                                showSearch
                                style={{ width: '100%' }}
                                placeholder='Please select'
                                filterOption={(input, option) =>
                                    ((option?.label as string) ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                options={listManager.map((user) => ({
                                    label: user.username,
                                    value: user.id,
                                }))}></Select>
                        </ModalItemWrapper>
                        <ModalItemWrapper
                            layout={{
                                xs: 24,
                                md: 12,
                            }}
                            label='Quyền'
                            name='roleName'
                            required>
                            <Select
                                mode='multiple'
                                maxLength={1}
                                allowClear
                                style={{ width: '100%' }}
                                placeholder='Please select'>
                                {listRole.map((role, index) => (
                                    <Option key={index} value={role}>
                                        {role}
                                    </Option>
                                ))}
                            </Select>
                        </ModalItemWrapper>
                        <ModalInput
                            required={false}
                            layout={{ xs: 24, md: 12 }}
                            label='SDT'
                            name='phoneNumber'
                        />

                        <ModalInput
                            layout={{ xs: 24, md: 12 }}
                            disabled={!isAddOrFix}
                            label='Username'
                            name='username'
                            required
                        />
                        <ModalInput
                            layout={{ xs: 24, md: 12 }}
                            label='Email'
                            name='email'
                            required
                        />
                        <ModalInput
                            layout={{ xs: 24, md: 12 }}
                            label={!isAddOrFix ? 'Reset Password' : 'Password'}
                            name='password'
                        />

                        <ModalItemWrapper layout={{ xs: 24, md: 24 }}>
                            <Checkbox
                                checked={userforTool}
                                onChange={() => setUserforTool(!userforTool)}>
                                Tạo tài khoản cho tool
                            </Checkbox>
                        </ModalItemWrapper>
                        {userforTool && (
                            <ModalInput
                                layout={{ xs: 24, md: 12 }}
                                label='ComputerID'
                                name='computerId'
                                required={userforTool}
                            />
                        )}
                    </Row>
                    <ModalBtnSubmit loading={loadingApiUser} ref={submitBtn} />
                </Form>
            </ModalWrapper>

            {/* --------------------------------------------Modal--------------------------------------------------- */}

            {/* --------------------------------------------Table--------------------------------------------------- */}
            <Table
                columns={columns}
                dataSource={listUser}
                pagination={{
                    ...tableParams.pagination,
                    total: totalUser,
                }}
                onChange={handleTableChange}
                tableLayout={'auto'}
                scroll={{ x: 900 }}
                loading={loading}
                rowKey='id'
            />
            {/* --------------------------------------------Table--------------------------------------------------- */}
        </MainLayout>
    );
};

export default UserPage;
