import { useEffect, useState } from "react";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import {
  Layout,
  Flex,
  Form,
  Typography,
  Table,
  Space,
  Button,
  type GetProp,
  type TableProps,
  Modal,
  Input,
} from "antd";
import type { SorterResult } from "antd/es/table/interface";

const { Title } = Typography;
const { Column } = Table;

type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

interface DataType {
  id: number;
  username: string;
  email: string;
  name: string;
  paternalLastName: string;
  maternalLastName: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const Users: React.FC = () => {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = () => {
    setLoading(true);
    fetch(
      `http://localhost:3000/users?page=${tableParams.pagination?.current || "1"}&size=10`,
    )
      .then((res) => res.json())
      .then(({ results, totalCount }) => {
        setData(results);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: totalCount,
          },
        });
      });
  };

  useEffect(fetchData, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
  ]);

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  // NOTE: Eliminar usuarios
  const deleteUser = (id: number) => {
    Modal.confirm({
      title: "¿Quieres eliminar este usuario?",
      okText: "Eliminar",
      okButtonProps: { variant: "solid", color: "danger" },
      cancelText: "Cancelar",
      onOk: async () => {
        const res = await fetch(`http://localhost:3000/users/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          fetchData();
        }
      },
    });
  };

  // NOTE: Editar usuarios
  const openModal = (userData: DataType) => {
    const modal = Modal.info({});

    modal.update({
      icon: null,
      title: "Editar usuario",
      okText: "Guardar",
      cancelText: "Cancelar",
      okButtonProps: { htmlType: "submit" },
      modalRender: (dom) => (
        <Form
          name="edit-user"
          initialValues={userData}
          style={{ width: "100%" }}
          onFinish={async (values) => {
            const res = await fetch(
              `http://localhost:3000/users/${userData.id}`,
              {
                method: "PUT",
                body: JSON.stringify(values),
                headers: new Headers({ "content-type": "application/json" }),
              },
            );

            if (res.ok) {
              fetchData();
            }
          }}
        >
          {dom}
        </Form>
      ),
      content: (
        <>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="paternalLastName"
            rules={[
              {
                required: true,
                message: "Please input your paternal last name!",
              },
            ]}
          >
            <Input placeholder="Paternal last name" />
          </Form.Item>

          <Form.Item
            name="maternalLastName"
            rules={[
              {
                required: true,
                message: "Please input your maternal last name!",
              },
            ]}
          >
            <Input placeholder="Maternal last name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>
        </>
      ),
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Content
        style={{ margin: "24px 16px", display: "flex", alignItems: "center" }}
      >
        <Flex
          vertical
          align="center"
          justify="center"
          style={{ width: "100%", marginInline: "auto" }}
        >
          <Title style={{ textAlign: "center" }}>Usuarios</Title>
          <Table<DataType>
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={tableParams.pagination}
            loading={loading}
            onChange={handleTableChange}
            style={{ width: "100%" }}
          >
            <Column<DataType>
              title="ID"
              dataIndex="id"
              key="id"
              sorter={(a, b) => a.id - b.id}
            />
            <Column<DataType>
              title="Email"
              dataIndex="email"
              key="email"
              sorter={(a, b) => (a.email > b.email ? 1 : 0)}
            />
            <Column<DataType>
              title="Name"
              dataIndex="name"
              key="name"
              sorter={(a, b) => (a.name > b.name ? 1 : 0)}
              render={(_, record) =>
                `${record.name} ${record.paternalLastName} ${record.maternalLastName}`
              }
            />
            <Column<DataType>
              title="Action"
              dataIndex="action"
              key="action"
              render={(_, record) => (
                <Space size="middle">
                  <Button
                    variant="outlined"
                    color="primary"
                    icon={<EditFilled />}
                    onClick={() => openModal(record)}
                  />
                  <Button
                    variant="outlined"
                    color="danger"
                    icon={<DeleteFilled />}
                    onClick={() => deleteUser(record.id)}
                  />
                </Space>
              )}
            />
          </Table>
        </Flex>
      </Layout.Content>
    </Layout>
  );
};

export default Users;
