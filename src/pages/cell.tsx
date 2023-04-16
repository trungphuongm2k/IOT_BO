import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Button, Form, Popconfirm, Row, Select, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import ModalWrapper from "../components/common/ModalWrapper";
import MainLayout from "../components/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import io from "socket.io-client";
import FilterWrapper from "../components/common/FilterWrapper";
import ModalBtnSubmit from "../components/common/ModalBtnSubmit";
import ModalInput from "../components/common/ModalInput";
import ModalItemWrapper from "../components/common/ModalItemWrapper";
import OptionSearch from "../components/common/OptionSearch";
import TitleSearch from "../components/common/TitleSearch";
import { Channel, Language, TableParams, User } from "../interface";
import { listCookieState } from "../interface/listData/channel";
import {
  createChannel,
  deleteChannel,
  deleteMultipleChannel,
  getAllChannel,
  getDetailChannel,
  updateChannel,
} from "../store/slice/channelSlice";
import { notiError } from "../utils/notification";

const { Option } = Select;

const PCIPage = () => {
  const [namePage, setNamePage] = useState<string>("Cell");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const submitBtn = useRef<any>();
  const { listChannel, loadingApiChannel, totalChannel } = useAppSelector(
    (state) => state.channel
  );
  const { role } = useAppSelector((state) => state.login);
  const { listManager } = useAppSelector((state) => state.user);
  const { listCountry } = useAppSelector((state) => state.country);
  const { listLanguage, total } = useAppSelector((state) => state.language);
  const { listTopic, totalTopic } = useAppSelector((state) => state.topic);

  const dispatch = useAppDispatch();
  const [reload, setReload] = useState<boolean>(false);
  const [isAddOrFix, setIsAddOrFix] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [listLanguageOption, setlistLanguageOption] = useState<Language[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "30"],
    },
    page: 1,
  });
  const [where, setWhere] = useState<any>({
    isDeleted: false,
  });
  const isAdmin = role?.includes("admin");

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

    dispatch(
      getAllChannel({
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
        setlistLanguageOption([]);
      },
      handleUpdate: (id: number | string) => {
        dispatch(getDetailChannel(id)).then((afterDispatch: any) => {
          if (afterDispatch.meta.requestStatus === "fulfilled") {
            form.resetFields();
            setIsOpenModal(true);
            setIsAddOrFix(false);
            const filter = listLanguage.filter(
              (language) =>
                afterDispatch.payload?.country.id === language.country?.id
            );
            setlistLanguageOption(filter);

            form.setFieldsValue({
              id: afterDispatch.payload?.id,
              email: afterDispatch.payload?.email,
              password: afterDispatch.payload?.password,
              nameOfChannel: afterDispatch.payload?.nameOfChannel,
              emailContact: afterDispatch.payload?.emailContact,
              kidsContent: afterDispatch.payload?.kidsContent,
              isPublishManual: afterDispatch.payload?.isPublishManual,
              isMoney: afterDispatch.payload?.isMoney,
              topicId: afterDispatch.payload?.topic?.id,
              countryId: afterDispatch.payload?.country?.id,
              languageId: afterDispatch.payload?.language?.id,
              channelId: afterDispatch.payload?.channelId,
              keywords: afterDispatch.payload?.keywords,
              channelDetail: afterDispatch.payload?.channelDetail,
              cookie: afterDispatch.payload?.cookie,
              maxVideoPublishPerday:
                afterDispatch.payload?.maxVideoPublishPerday,
            });
          }
        });
      },

      handleCreateChannel: (data: any) => {
        dispatch(
          createChannel({
            ...data,
          })
        ).then((afterDispatch: any) => {
          if (afterDispatch.meta.requestStatus !== "fulfilled") return;
          action().handleCancelModal();
          setReload((state) => !state);
        });
      },
      handleUpdateChannel: (updateData: any) => {
        dispatch(updateChannel(updateData)).then((afterDispatch: any) => {
          if (afterDispatch.meta.requestStatus === "fulfilled") {
            action().handleCancelModal();
          }
        });
      },
      handleDelete: (id: number | string) => {
        dispatch(deleteChannel(id));
      },
    };
  };

  const onSubmitForm = async (values: any) => {
    if (isAddOrFix) {
      action().handleCreateChannel({
        ...values,
      });
    } else {
      action().handleUpdateChannel({
        ...values,
      });
    }
  };

  const onSubmitFormFailed = (errorInfo: any) => {
    notiError("Vui lòng điền đủ các trường bắt buộc.");
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      pagination: { ...pagination },
    });
  };
  const handleUpdateFilter = (value: any) => {
    const newFilter: Record<string, any> = {
      isDeleted: false,
    };
    Object.entries(value).forEach((entry) => {
      const [key, value] = entry;
      if (value || value === false) {
        if (key === "topicId") {
          newFilter.topic = {
            id: value,
          };
        } else if (key === "countryId") {
          newFilter.country = {
            id: value,
          };
        } else if (key === "userId") {
          newFilter.user = {
            id: value,
          };
        } else newFilter[key] = value;
      }
    });
    console.log(newFilter, "filter");
    setWhere(newFilter);
  };
  const columns: ColumnsType<Channel> = [
    {
      title: "#",
      key: "count",
      fixed: "left",
      width: 50,
      render: (text: string, record: Channel, index: number) => {
        return <span className="font-bold">{index + 1}</span>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "id",
      fixed: "left",
      key: "action",
      width: 100,
      render: (id: number | string) => (
        <div key={id} className="flex gap-2">
          <Button
            className="bg-[#1890ff]"
            type="primary"
            icon={<EditFilled />}
            onClick={() => action().handleUpdate(id)}
          />

          <Popconfirm
            placement="top"
            title="Bạn muốn xóa bản ghi này?"
            onConfirm={() => action().handleDelete(id)}
            okText="Yes"
            okButtonProps={{
              loading: loadingApiChannel,
            }}
            cancelText="No"
          >
            <Button type="primary" icon={<DeleteFilled />} danger />
          </Popconfirm>
        </div>
      ),
    },

    {
      title: "Tên kênh",
      dataIndex: "nameOfChannel",
      fixed: "left",
      width: 300,
      render: (nameOfChannel: string) => (
        <span className="font-semibold">{nameOfChannel}</span>
      ),
    },

    {
      title: "Trạng thái Cookie",
      dataIndex: "cookieState",
      width: 160,
      render: (state: string) => {
        const stateFind = listCookieState.find((item) => item.value === state);
        if (!stateFind) return <span>Chưa setup</span>;
        return <Tag color={stateFind.color}>{stateFind.title}</Tag>;
      },
    },

    {
      title: "Id kênh",
      dataIndex: "channelId",
      width: 200,
      render: (channelId: string) => {
        const replaceId = () => {
          if (channelId.indexOf("https://www.youtube.com/") >= 0) {
            const id = channelId.replace("https://www.youtube.com/", "");
            if (id.indexOf("channel") >= 0) return id.replace("channel/", "");
            return id;
          }
          if (channelId.indexOf("https://youtube.com/") >= 0) {
            const id = channelId.replace("https://youtube.com/", "");
            if (id.indexOf("channel") >= 0) return id.replace("channel/", "");
            return id;
          }
          return "";
        };

        return replaceId() ? (
          <a
            href={channelId}
            target="_blank"
            className="text-[#2335ff]"
            rel="noreferrer"
          >
            {replaceId()}
          </a>
        ) : (
          <span>Id video không đúng định dạng</span>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 250,
      render: (email: string) => (
        <span className="font-semibold text-[#da2b2b]">{email}</span>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "user",
      width: 100,
      render: (user: User) => (
        <span className="text-[#21db00] text-xs font-bold">
          {user?.username}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 100,
      render: (createdAt: string) => (
        <span className="text-[#2335ff] text-xs font-semibold">
          {moment(createdAt).format("L LT")}
        </span>
      ),
    },
    {
      title: "Ngày sửa",
      dataIndex: "updatedAt",
      width: 100,
      render: (updatedAt: string) => (
        <span className="text-[#2335ff] text-xs font-semibold">
          {moment(updatedAt).format("L LT")}
        </span>
      ),
    },
  ];

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const [message, setMessage] = useState("");
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("hello", (data) => {
      console.log(data);
      setMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <MainLayout
      title={`Quản lý ${namePage}`}
      namePage={namePage}
      reLoadCb={action().handleReLLoad}
      addRecordCb={action().handleAddRecord}
      loading={loadingApiChannel}
    >
      {/* --------------------------------------------Filter--------------------------------------------------- */}
      <FilterWrapper updateFilter={handleUpdateFilter}>
        <OptionSearch
          label="Tìm theo cellid"
          name="countryId"
          placeholder="Lựa chọn  cells"
          listOption={
            listCountry.length > 0
              ? listCountry.map((country) => ({
                  id: country.id,
                  title: country.name,
                }))
              : []
          }
        />
        {isAdmin && (
          <OptionSearch
            label="Tìm theo tài khoản"
            name="userId"
            placeholder="Lựa chọn tài khoản"
            listOption={
              listManager.length > 0
                ? listManager.map((user) => ({
                    id: user.id,
                    title: user.username,
                  }))
                : []
            }
          />
        )}

        <TitleSearch
          label="Tìm theo tên kênh"
          name="nameOfChannel"
          placeholder="Nhập vào tên"
        />
        <TitleSearch
          label="Tìm theo Id kênh"
          name="channelId"
          placeholder="Nhập vào id"
        />
        <OptionSearch
          label="Tìm theo danh mục"
          name="topicId"
          placeholder="Lựa chọn danh mục"
          listOption={
            listTopic.length > 0
              ? listTopic.map((topic) => ({
                  id: topic.id,
                  title: topic.name,
                }))
              : []
          }
        />

        <OptionSearch
          label="Kênh sống/chết"
          name="isPublishManual"
          placeholder="Lựa chọn trạng thái"
          listOption={[
            { id: true, title: "Kênh sống" },
            { id: false, title: "Kênh chết" },
          ]}
        />
      </FilterWrapper>
      {/* --------------------------------------------Modal--------------------------------------------------- */}
      <ModalWrapper
        title={isAddOrFix ? `Thêm ${namePage} mới` : `Chỉnh sửa ${namePage}`}
        isOpen={isOpenModal}
        onCancel={action().handleCancelModal}
        titleBtn={isAddOrFix ? "Thêm mới" : "Sửa"}
        submitBtnRef={submitBtn}
        loadingApi={loadingApiChannel}
      >
        <Form
          name="basic"
          form={form}
          {...layout}
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onSubmitForm}
          onFinishFailed={onSubmitFormFailed}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            {!isAddOrFix && (
              <div className="hidden">
                <ModalInput
                  layout={{ xs: 24, md: 12 }}
                  label="Id"
                  name="id"
                  required
                  disabled
                />
              </div>
            )}
          </Row>
          <Row gutter={[16, 0]}>
            <ModalInput
              layout={{ xs: 24, md: 6 }}
              label="Email"
              name="email"
              required
              rule={[
                {
                  type: "email",
                  message: "Vui lòng nhập vào email E-mail!",
                },
              ]}
            />

            <ModalInput
              layout={{ xs: 24, md: 6 }}
              label="Tên cell"
              name="nameOfChannel"
              required={true}
              rule={[
                {
                  validator: (_: any, value: any) => {
                    if (value.length > 100)
                      return Promise.reject(
                        new Error("Tiêu đề giới hạn 100 ký tự")
                      );
                    return Promise.resolve();
                  },
                },
              ]}
            />
            <ModalInput
              layout={{ xs: 24, md: 6 }}
              label="Email xác minh"
              name="emailContact"
              rule={[
                {
                  type: "email",
                  message: "Vui lòng nhập vào email E-mail!",
                },
              ]}
            />

            <ModalItemWrapper
              layout={{ xs: 24, md: 6 }}
              label="Danh mục"
              name="topicId"
              required
            >
              <Select
                maxLength={1}
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
              >
                {listTopic.length > 0 &&
                  listTopic.map((topic) => (
                    <Option key={topic.id} value={topic.id}>
                      {topic.name}
                    </Option>
                  ))}
              </Select>
            </ModalItemWrapper>
            <ModalItemWrapper
              layout={{ xs: 24, md: 12 }}
              label="Quốc gia"
              name="countryId"
              required
            >
              <Select
                maxLength={1}
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={() => {
                  const CountryId = form.getFieldValue("countryId");
                  const filter = listLanguage.filter(
                    (language) => CountryId === language.country?.id
                  );
                  form.setFieldsValue({
                    languageId: [],
                  });
                  setlistLanguageOption(filter);
                }}
              >
                {listCountry.length > 0 &&
                  listCountry.map((country) => (
                    <Option key={country.id} value={country.id}>
                      {country.name}
                    </Option>
                  ))}
              </Select>
            </ModalItemWrapper>

            <ModalItemWrapper
              layout={{ xs: 24, md: 12 }}
              label="Ngôn ngữ"
              name="languageId"
              required
            >
              <Select
                maxLength={1}
                allowClear
                style={{ width: "100%" }}
                placeholder="Vui lòng chọn quốc gia trước"
              >
                {listLanguageOption.length > 0 &&
                  listLanguageOption.map((language) => (
                    <Option key={language.id} value={language.id}>
                      {language.name}
                    </Option>
                  ))}
              </Select>
            </ModalItemWrapper>
          </Row>

          <ModalBtnSubmit loading={loadingApiChannel} ref={submitBtn} />
        </Form>
      </ModalWrapper>
      {/* --------------------------------------------Modal--------------------------------------------------- */}
      {/* --------------------------------------------Table--------------------------------------------------- */}
      <div className="w-full h-[1px] bg-[#00bbff]"></div>
      {selectedRowKeys.length > 0 && (
        <div className="my-[10px] mt-[20px]">
          <Popconfirm
            placement="top"
            title="Bạn chắc chắn muốn xóa hàng loạt."
            onConfirm={() => {
              dispatch(
                deleteMultipleChannel(selectedRowKeys as number[] | string[])
              ).then((afterDispatch: any) => {
                if (afterDispatch.meta.requestStatus === "fulfilled") {
                  setSelectedRowKeys([]);
                }
              });
            }}
            okText="Yes"
            disabled={!selectedRowKeys.length}
            okButtonProps={{
              loading: loadingApiChannel,
            }}
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              disabled={!selectedRowKeys.length}
              loading={loadingApiChannel}
            >
              Xóa hàng loạt
            </Button>
          </Popconfirm>
          <span style={{ marginLeft: 8 }}>
            {selectedRowKeys.length
              ? `Xóa ${selectedRowKeys.length} bản ghi`
              : ""}
          </span>
        </div>
      )}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={listChannel}
        pagination={{
          ...tableParams.pagination,
          total: totalChannel,
        }}
        onChange={handleTableChange}
        tableLayout={"auto"}
        scroll={{ x: 1800, y: 700 }}
        loading={loading}
        rowKey="id"
      />
      {/* --------------------------------------------Table--------------------------------------------------- */}
    </MainLayout>
  );
};

export default PCIPage;
