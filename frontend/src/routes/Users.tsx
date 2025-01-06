import { useEffect, useState } from "react";
import { DeleteFilled, EditFilled, SearchOutlined } from "@ant-design/icons";
import {
  Layout,
  Flex,
  Form,
  Typography,
  Table,
  Space,
  Button,
  Modal,
  Input,
  type TableColumnType,
  type TablePaginationConfig,
} from "antd";

const { Title } = Typography;
const { Column } = Table;

type User = {
  id: number;
  username: string;
  email: string;
  name: string;
  paternalLastName: string;
  maternalLastName: string;
};

type DataIndex = keyof User;

const Users: React.FC = () => {
  const [data, setData] = useState<User[]>();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const { current: currentPage } = pagination;

  const fetchData = () => {
    setLoading(true);
    fetch(`http://localhost:3000/users?page=${currentPage || "1"}&size=10`)
      .then((res) => res.json())
      .then(({ results, totalCount }) => {
        setData(results);
        setLoading(false);
        setPagination((state) => ({ ...state, total: totalCount }));
      });
  };

  useEffect(fetchData, [currentPage]);

  // NOTE: Función para obtener las props necesarias para la funcionalidad de filtrado
  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): TableColumnType<User> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder="Buscar"
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters?.();
              confirm();
              close();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  });

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
          <Table<User>
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={(pagination) => {
              setPagination(pagination);
            }}
            style={{ width: "100%" }}
            scroll={{ x: "max-content" }}
          >
            <Column<User>
              title="ID"
              dataIndex="id"
              key="id"
              sorter={(a, b) => a.id - b.id}
              {...getColumnSearchProps("id")}
            />

            <Column<User>
              title="Name"
              dataIndex="name"
              key="name"
              sorter={(a, b) => a.name.localeCompare(b.name)}
              render={(_, record) =>
                `${record.name} ${record.paternalLastName} ${record.maternalLastName}`
              }
              {...getColumnSearchProps("name")}
              // NOTE: Filtro personalizado para poder filtrar el nombre completo
              onFilter={(value, record) =>
                `${record.name} ${record.paternalLastName} ${record.maternalLastName}`
                  .toString()
                  .toLowerCase()
                  .includes((value as string).toLowerCase())
              }
            />

            <Column<User>
              title="Email"
              dataIndex="email"
              key="email"
              sorter={(a, b) => a.email.localeCompare(b.email)}
              {...getColumnSearchProps("email")}
            />

            <Column<User>
              title="Action"
              dataIndex="action"
              key="action"
              render={(_, record) => (
                <Space size="middle">
                  <Button
                    variant="outlined"
                    color="primary"
                    icon={<EditFilled />}
                    onClick={() => openUserEditModal(record, fetchData)}
                  />
                  <Button
                    variant="outlined"
                    color="danger"
                    icon={<DeleteFilled />}
                    onClick={() => openUserDeleteModal(record.id, fetchData)}
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

const openUserDeleteModal = (id: number, onSucess: () => void) => {
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
        onSucess();
      }
    },
  });
};

const openUserEditModal = (user: User, onSucess: () => void) => {
  Modal.info({
    icon: null,
    title: "Editar usuario",
    okText: "Guardar",
    cancelText: "Cancelar",
    okButtonProps: { htmlType: "submit" },
    modalRender: (dom) => (
      <Form
        name="edit-user"
        initialValues={user}
        style={{ width: "100%" }}
        onFinish={async (values) => {
          const res = await fetch(`http://localhost:3000/users/${user.id}`, {
            method: "PUT",
            body: JSON.stringify(values),
            headers: new Headers({ "content-type": "application/json" }),
          });

          if (res.ok) {
            onSucess();
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

export default Users;
