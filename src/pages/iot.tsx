import { Form, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import MainLayout from "../components/MainLayout";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import FilterWrapper from "../components/common/FilterWrapper";
import TitleSearch from "../components/common/TitleSearch";
import { Country, TableParams } from "../interface";
import {
  createCountry,
  deleteCountry,
  getAllCountry,
  getDetailCountry,
  updateCountry,
} from "../store/slice/countrySlice";

const CountryPage = () => {
  const [namePage, setNamePage] = useState<string>("Dữ liêu đo được  từ cell");

  const submitBtn = useRef<any>();
  const { listCountry, totalCountry, loadingApiCountry } = useAppSelector(
    (state) => state.country
  );
  const dispatch = useAppDispatch();
  const [reload, setReload] = useState<boolean>(false);
  const [isAddOrFix, setIsAddOrFix] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "30"],
    },
    page: 1,
  });
  const [where, setWhere] = useState<any>({});
  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    dispatch(
      getAllCountry({
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
        dispatch(getDetailCountry(id)).then((afterDispatch: any) => {
          if (afterDispatch.meta.requestStatus === "fulfilled") {
            form.resetFields();
            setIsOpenModal(true);
            setIsAddOrFix(false);
            form.setFieldsValue({
              id: afterDispatch.payload?.id,
              name: afterDispatch.payload?.name,
              code: afterDispatch.payload?.code,
            });
          }
        });
      },

      handleCreateCountry: ({ name, code }: any) => {
        dispatch(
          createCountry({
            name,
            code,
          })
        ).then((afterDispatch: any) => {
          if (afterDispatch.meta.requestStatus !== "fulfilled") return;
          action().handleCancelModal();
          setReload((state) => !state);
        });
      },
      handleUpdateCountry: (updateData: any) => {
        dispatch(updateCountry(updateData)).then((afterDispatch: any) => {
          if (afterDispatch.meta.requestStatus === "fulfilled") {
            action().handleCancelModal();
          }
        });
      },
      handleDelete: (id: number | string) => {
        dispatch(deleteCountry(id));
      },
    };
  };

  const onSubmitForm = async (values: any) => {
    console.log("first");
    if (isAddOrFix) {
      const { name, code } = values;
      action().handleCreateCountry({
        name,
        code,
      });
    } else {
      const { id, name, code } = values;
      action().handleUpdateCountry({ id, name, code });
    }
  };

  const onSubmitFormFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      pagination: { ...pagination },
    });
  };

  const handleUpdateFilter = (value: any) => {
    const { name } = value;
    const newFilter: Record<string, any> = {
      isDeleted: false,
    };

    if (name) newFilter.name = name;
    setWhere(newFilter);
  };

  const columns: ColumnsType<Country> = [
    {
      title: "#",
      key: "count",
      width: 50,
      render: (text: string, record: Country, index: number) => {
        return index + 1;
      },
    },

    {
      title: "Tên pci",
      dataIndex: "pci",
      width: "auto",
      render: (name: string) => <span className="font-semibold">{name}</span>,
    },
    {
      title: "Tên",
      dataIndex: "mcc",
      width: "auto",
      render: (name: string) => <span className="font-semibold">{name}</span>,
    },
    {
      title: "RSRQ",
      dataIndex: "rsrp",
      width: "auto",
      render: (code: string) => <span className="text-[#2335ff]">{code}</span>,
    },
    {
      title: "RSRQ",
      dataIndex: "rsrq",
      width: "auto",
      render: (code: string) => <span className="text-[#2335ff]">{code}</span>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 200,
      render: (createdAt: string) => (
        <span className="text-[#2335ff]">
          {moment(createdAt).format("L LT")}
        </span>
      ),
    },
    {
      title: "Ngày sửa",
      dataIndex: "updatedAt",
      width: 200,
      render: (updatedAt: string) => (
        <span className="text-[#2335ff]">
          {moment(updatedAt).format("L LT")}
        </span>
      ),
    },
  ];

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const yValues = [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15];
  const xValues = ["50"];
  let xStringValues: string[];
  useEffect(() => {
    xStringValues = xValues.map(String);
  }, []);
  return (
    <MainLayout
      title={`Quản lý ${namePage}`}
      namePage={namePage}
      reLoadCb={action().handleReLLoad}
      addRecordCb={action().handleAddRecord}
      loading={loadingApiCountry}
    >
      {/* <LineGraph data={yValues} labels={xValues}></LineGraph> */}
      {/* --------------------------------------------Filter--------------------------------------------------- */}
      <FilterWrapper updateFilter={handleUpdateFilter}>
        <TitleSearch
          label="Tìm theo tên"
          name="name"
          placeholder="Nhập vào tên"
        />
      </FilterWrapper>
      {/* --------------------------------------------Modal--------------------------------------------------- */}
      {/* --------------------------------------------Modal--------------------------------------------------- */}
      {/* --------------------------------------------Table--------------------------------------------------- */}
      <Table
        columns={columns}
        dataSource={listCountry}
        pagination={{
          ...tableParams.pagination,
          total: totalCountry,
        }}
        onChange={handleTableChange}
        tableLayout={"auto"}
        scroll={{ x: 900 }}
        loading={loading}
        rowKey="id"
      />
      {/* --------------------------------------------Table--------------------------------------------------- */}
    </MainLayout>
  );
};

export default CountryPage;
