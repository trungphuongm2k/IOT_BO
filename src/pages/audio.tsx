import { DeleteFilled, EditFilled, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Popconfirm, Row, Table, Upload, Image, Popover, Select, Tag } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import FilterWrapper from '../components/common/FilterWrapper';
import ModalBtnSubmit from '../components/common/ModalBtnSubmit';
import ModalInput from '../components/common/ModalInput';
import ModalItemWrapper from '../components/common/ModalItemWrapper';
import ModalWrapper from '../components/common/ModalWrapper';
import OptionSearch from '../components/common/OptionSearch';
import TitleSearch from '../components/common/TitleSearch';
import MainLayout from '../components/MainLayout';
import { Audio, Language, TableParams, User } from '../interface';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    createAudio,
    deleteAudio,
    deleteMultipleAudio,
    getAllAudio,
    getDetailAudio,
    updateAudio,
} from '../store/slice/audioSlice';
import { getAllCountry } from '../store/slice/countrySlice';
import { getAllLanguage } from '../store/slice/languageSlice';
import ModalTextArea from '../components/common/ModalTextArea';

const { Option } = Select;

const listKind = [
    { title: 'Nhạc Pop', value: 'POP' },
    { title: 'Nhạc Indie', value: 'INDIE' },
    { title: 'Nhạc Rap', value: 'RAP' },
    { title: 'Nhạc Rock', value: 'ROCK' },
    { title: 'Nhạc buồn', value: 'BLUE' },
    { title: 'Nhạc remix', value: 'REMIX' },
    { title: 'Nhạc nhảy', value: 'DANCE' },
    { title: 'Nhạc latin', value: 'LATIN' },
    { title: 'Nhạc không lời', value: 'INSTRUMENTAL' },
];

const listMode = [
    { title: 'Nhạc bản quyền', value: 'COPYRIGHT' },
    { title: 'Nhạc không bản quyền', value: 'NONCOPYRIGHT' },
    { title: 'Claim Id', value: 'CLAIMID' },
];

const AudioPage = () => {
    const [namePage, setNamePage] = useState<string>('Âm thanh');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const submitBtn = useRef<any>();
    const { listAudio, totalAudio, loadingApiAudio } = useAppSelector((state) => state.audio);
    const { listCountry, totalCountry } = useAppSelector((state) => state.country);
    const { listLanguage, total } = useAppSelector((state) => state.language);
    const dispatch = useAppDispatch();
    const [reload, setReload] = useState<boolean>(false);
    const [isAddOrFix, setIsAddOrFix] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [listLanguageOption, setlistLanguageOption] = useState<Language[]>([]);
    console.log();

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

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    useEffect(() => {
        setLoading(true);
        if (listCountry.length !== totalCountry || listCountry.length === 0) {
            dispatch(
                getAllCountry({
                    where: { isDeleted: false },
                })
            );
        }
        if (listLanguage.length !== total || listLanguage.length === 0) {
            dispatch(
                getAllLanguage({
                    where: { isDeleted: false },
                })
            );
        }
        dispatch(
            getAllAudio({
                page: tableParams.pagination?.current as number,
                perPage: tableParams.pagination?.pageSize as number,
                where,
            })
        ).then(() => {
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, JSON.stringify(tableParams), JSON.stringify(where)]);

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
            },
            handleUpdate: (id: number | string) => {
                dispatch(getDetailAudio(id)).then((afterDispatch: any) => {
                    if (afterDispatch.meta.requestStatus === 'fulfilled') {
                        form.resetFields();
                        setIsOpenModal(true);
                        setIsAddOrFix(false);
                        const filter = listLanguage.filter(
                            (language) => afterDispatch.payload?.country.id === language.country?.id
                        );
                        setlistLanguageOption(filter);
                        form.setFieldsValue({
                            id: afterDispatch.payload?.id,
                            name: afterDispatch.payload?.name,
                            kind: afterDispatch.payload?.kind,
                            mode: afterDispatch.payload?.mode,
                            source: afterDispatch.payload?.source,
                            lyric: afterDispatch.payload?.lyric,
                            countryId: afterDispatch.payload?.country.id,
                            languageId: afterDispatch.payload?.language.id,
                        });
                    }
                });
            },

            handleCreateAudio: (data: any) => {
                dispatch(createAudio(data)).then((afterDispatch: any) => {
                    if (afterDispatch.meta.requestStatus !== 'fulfilled') return;
                    action().handleCancelModal();
                    setReload((state) => !state);
                });
            },
            handleUpdateAudio: (updateData: any) => {
                dispatch(updateAudio(updateData)).then((afterDispatch: any) => {
                    if (afterDispatch.meta.requestStatus === 'fulfilled') {
                        action().handleCancelModal();
                    }
                });
            },
            handleDelete: (id: number | string) => {
                dispatch(deleteAudio(id));
            },
        };
    };

    const onSubmitForm = async (values: any) => {
        if (isAddOrFix) {
            const { fileAudio, fileThumb } = values;
            values.fileAudio = fileAudio.fileList[0].originFileObj;
            values.fileThumb = fileThumb.fileList[0].originFileObj;
            action().handleCreateAudio({
                ...values,
            });
        } else {
            const { fileAudio, fileThumb } = values;
            values.fileAudio = fileAudio ? fileAudio.fileList[0].originFileObj : null;
            values.fileThumb = fileThumb ? fileThumb.fileList[0].originFileObj : null;
            action().handleUpdateAudio({
                ...values,
            });
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
        const { name, kind, mode } = value;
        const newFilter: Record<string, any> = {
            isDeleted: false,
        };

        if (name) newFilter.name = name;
        if (kind) newFilter.kind = kind;
        if (mode) newFilter.mode = mode;

        setWhere(newFilter);
    };

    const columns: ColumnsType<Audio> = [
        {
            title: '#',
            key: 'count',
            fixed: 'left',
            width: 50,
            render: (text: string, record: Audio, index: number) => {
                return <span className='font-bold'>{index + 1}</span>;
            },
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            fixed: 'left',
            key: 'action',
            width: 100,
            render: (id: number | string) => (
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
                            loading: loadingApiAudio,
                        }}
                        cancelText='No'>
                        <Button type='primary' icon={<DeleteFilled />} danger />
                    </Popconfirm>
                </div>
            ),
        },
        {
            title: 'Tên',
            fixed: 'left',
            dataIndex: 'name',
            width: 'auto',
            render: (name: string) => <span className='font-semibold'>{name}</span>,
        },
        {
            title: 'Ảnh minh họa',
            dataIndex: 'thumb',
            width: 120,
            render: (thumb: string) => (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image
                    width={120}
                    height={100}
                    loading='lazy'
                    style={{ objectFit: 'cover' }}
                    src={`${process.env.HOST_NAME_API}/container/audio/download/${thumb}`}
                />
            ),
        },
        {
            title: 'Tải xuống ',
            dataIndex: 'path',
            width: 100,
            render: (path: string) => (
                <a
                    href={`${process.env.HOST_NAME_API}/gstorage/download?id=${path}`}
                    className='text-[#2335ff]'
                    target={'_blank'}
                    download
                    rel='noreferrer'>
                    Tải xuống
                </a>
            ),
        },
        {
            title: 'Nghe thử',
            dataIndex: 'path',
            width: '150',
            render: (path: string) => (
                <Popover
                    placement='top'
                    content={
                        <div className='p-[10px]'>
                            <ReactPlayer
                                url={`${process.env.HOST_NAME_API}/gstorage/download?id=${path}`}
                                width='400px'
                                height='50px'
                                controls
                            />
                        </div>
                    }
                    trigger='click'>
                    <Button>Nghe</Button>
                </Popover>
            ),
        },
        {
            title: 'Nguồn',
            dataIndex: 'source',
            width: 200,
            render: (source: string) =>
                source ? (
                    <a
                        href={`${source}`}
                        className='text-[#2335ff]'
                        target={'_blank'}
                        rel='noreferrer'>
                        Go to link
                    </a>
                ) : (
                    <span>Chưa gắn nguồn</span>
                ),
        },
        {
            title: 'Thể loại',
            dataIndex: 'kind',
            width: 150,
            render: (kind: string) => <span className='font-semibold text-[red]'>{kind}</span>,
        },
        {
            title: 'Bản quyền',
            dataIndex: 'mode',
            width: 200,
            render: (mode: string) => <Tag color='cyan'>{mode}</Tag>,
        },
        {
            title: 'Ngôn ngữ',
            dataIndex: 'language',
            width: 150,
            render: (language: Language) => (
                <span className='font-semibold text-[green]'>{language.name}</span>
            ),
        },
        {
            title: 'Người tạo',
            dataIndex: 'user',
            width: 150,
            render: (user: User) => (
                <span className='text-[#21db00] text-xs font-bold'>{user?.username}</span>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 40,
            render: (createdAt: string) => (
                <span className='text-[#2335ff] text-xs font-bold'>
                    {moment(createdAt).format('L HH:mm')}
                </span>
            ),
        },
        {
            title: 'Ngày sửa',
            dataIndex: 'updatedAt',
            width: 40,
            render: (updatedAt: string) => (
                <span className='text-[#2335ff] text-xs font-bold'>
                    {moment(updatedAt).format('L HH:mm')}
                </span>
            ),
        },
    ];

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    return (
        <MainLayout
            title={`Quản lý ${namePage}`}
            namePage={namePage}
            reLoadCb={action().handleReLLoad}
            addRecordCb={action().handleAddRecord}
            loading={loadingApiAudio}>
            {/* --------------------------------------------Filter--------------------------------------------------- */}
            <FilterWrapper updateFilter={handleUpdateFilter}>
                <TitleSearch label='Tìm theo tên' name='name' placeholder='Nhập vào tên' />
                <OptionSearch
                    label='Tìm theo thể loại'
                    name='kind'
                    placeholder='Lựa chọn thể loại'
                    listOption={listKind.map((kind) => ({
                        id: kind.value,
                        title: kind.title,
                    }))}
                />
                <OptionSearch
                    label='Bản quyền'
                    name='mode'
                    placeholder='Lựa chọn'
                    listOption={listMode.map((mode) => ({
                        id: mode.value,
                        title: mode.title,
                    }))}
                />
            </FilterWrapper>
            {/* --------------------------------------------Modal--------------------------------------------------- */}

            <ModalWrapper
                title={isAddOrFix ? `Thêm ${namePage} mới` : `Chỉnh sửa ${namePage}`}
                isOpen={isOpenModal}
                onCancel={action().handleCancelModal}
                titleBtn={isAddOrFix ? 'Thêm mới' : 'Sửa'}
                submitBtnRef={submitBtn}
                loadingApi={loadingApiAudio}>
                <Form
                    name='basic'
                    form={form}
                    {...layout}
                    layout='vertical'
                    initialValues={{ remember: true }}
                    onFinish={onSubmitForm}
                    onFinishFailed={onSubmitFormFailed}
                    autoComplete='off'>
                    <div className='hidden'>
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
                    </div>
                    <Row gutter={[16, 0]}>
                        <ModalInput layout={{ xs: 24, md: 12 }} label='Tên' name='name' required />
                        <ModalInput
                            layout={{ xs: 24, md: 12 }}
                            label='Nguồn âm thanh'
                            name='source'
                            rule={[
                                {
                                    type: 'url',
                                    message: 'Vui lòng nhập vào Url!',
                                },
                            ]}
                        />

                        <ModalItemWrapper
                            layout={{ xs: 24, md: 6 }}
                            label='Quốc gia'
                            name='countryId'
                            required>
                            <Select
                                maxLength={1}
                                allowClear
                                style={{ width: '100%' }}
                                placeholder='Please select'
                                onChange={() => {
                                    const listCountryId = form.getFieldValue('countryId');
                                    const filter = listLanguage.filter(
                                        (language) => listCountryId === language.country?.id
                                    );
                                    form.setFieldsValue({
                                        languageId: [],
                                    });
                                    setlistLanguageOption(filter);
                                }}>
                                {listCountry.length > 0 &&
                                    listCountry.map((country) => (
                                        <Option key={country.id} value={country.id}>
                                            {country.name}
                                        </Option>
                                    ))}
                            </Select>
                        </ModalItemWrapper>
                        <ModalItemWrapper
                            layout={{ xs: 24, md: 6 }}
                            label='Ngôn ngữ'
                            name='languageId'
                            required>
                            <Select
                                maxLength={1}
                                allowClear
                                style={{ width: '100%' }}
                                placeholder='Please select'>
                                {listLanguageOption.length > 0 &&
                                    listLanguageOption.map((language) => (
                                        <Option key={language.id} value={language.id}>
                                            {language.name}
                                        </Option>
                                    ))}
                            </Select>
                        </ModalItemWrapper>
                        <ModalItemWrapper
                            layout={{ xs: 24, md: 6 }}
                            label='Thể loại'
                            name='kind'
                            required>
                            <Select
                                maxLength={1}
                                allowClear
                                style={{ width: '100%' }}
                                placeholder='Please select'>
                                {listKind.map((kind, index) => (
                                    <Option key={index} value={kind.value}>
                                        {kind.title}
                                    </Option>
                                ))}
                            </Select>
                        </ModalItemWrapper>
                        <ModalItemWrapper
                            layout={{ xs: 24, md: 6 }}
                            label='Bản quyền'
                            name='mode'
                            required>
                            <Select
                                maxLength={1}
                                allowClear
                                style={{ width: '100%' }}
                                placeholder='Please select'>
                                {listMode.map((mode, index) => (
                                    <Option key={index} value={mode.value}>
                                        {mode.title}
                                    </Option>
                                ))}
                            </Select>
                        </ModalItemWrapper>
                        <ModalTextArea
                            layout={{ xs: 24, md: 24 }}
                            label='Lyric'
                            name='lyric'
                            required={false}
                        />
                        <ModalItemWrapper
                            layout={{ xs: 12, md: 6 }}
                            label='Ảnh minh họa'
                            name='fileThumb'
                            required={isAddOrFix}>
                            <Upload
                                maxCount={1}
                                listType='picture'
                                multiple={false}
                                beforeUpload={() => {
                                    return false;
                                }}
                                withCredentials={false}
                                showUploadList={true}
                                accept='image/jpeg, image/png'>
                                <Button icon={<UploadOutlined />} block>
                                    <span>Chọn file hỉnh ảnh </span>
                                    {!isAddOrFix && (
                                        <span className='pl-1 text-[red]'>
                                            (nếu cần update file mới)
                                        </span>
                                    )}
                                </Button>
                            </Upload>
                        </ModalItemWrapper>
                        <ModalItemWrapper
                            layout={{ xs: 12, md: 6 }}
                            label='Âm thanh'
                            name='fileAudio'
                            required={isAddOrFix}>
                            <Upload
                                maxCount={1}
                                listType='picture'
                                multiple={false}
                                beforeUpload={() => {
                                    return false;
                                }}
                                withCredentials={false}
                                showUploadList={true}
                                accept='.mp3, .wav'>
                                <Button icon={<UploadOutlined />} block>
                                    <span>Chọn file âm thanh </span>
                                    {!isAddOrFix && (
                                        <span className='pl-1 text-[red]'>
                                            (nếu cần update file mới)
                                        </span>
                                    )}
                                </Button>
                            </Upload>
                        </ModalItemWrapper>
                    </Row>
                    <ModalBtnSubmit loading={loadingApiAudio} ref={submitBtn} />
                </Form>
            </ModalWrapper>

            {/* --------------------------------------------Modal--------------------------------------------------- */}

            {/* --------------------------------------------Table--------------------------------------------------- */}
            <div className='w-full h-[1px] bg-[#00bbff]'></div>
            {selectedRowKeys.length > 0 && (
                <div className='my-[10px] mt-[20px]'>
                    <Popconfirm
                        placement='top'
                        title='Bạn chắc chắn muốn xóa hàng loạt.'
                        onConfirm={() => {
                            dispatch(
                                deleteMultipleAudio(selectedRowKeys as number[] | string[])
                            ).then((afterDispatch: any) => {
                                if (afterDispatch.meta.requestStatus === 'fulfilled') {
                                    setSelectedRowKeys([]);
                                }
                            });
                        }}
                        okText='Yes'
                        disabled={!selectedRowKeys.length}
                        okButtonProps={{
                            loading: loadingApiAudio,
                        }}
                        cancelText='No'>
                        <Button
                            type='primary'
                            danger
                            disabled={!selectedRowKeys.length}
                            loading={loadingApiAudio}>
                            Xóa hàng loạt
                        </Button>
                    </Popconfirm>
                    <span style={{ marginLeft: 8 }}>
                        {selectedRowKeys.length ? `Xóa ${selectedRowKeys.length} bản ghi` : ''}
                    </span>
                </div>
            )}
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={listAudio}
                pagination={{
                    ...tableParams.pagination,
                    total: totalAudio,
                }}
                onChange={handleTableChange}
                tableLayout={'auto'}
                scroll={{ x: 1800, y: 700 }}
                loading={loading}
                rowKey='id'
            />
            {/* --------------------------------------------Table--------------------------------------------------- */}
        </MainLayout>
    );
};

export default AudioPage;
