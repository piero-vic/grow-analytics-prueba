import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import {
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
import {
  deleteUser,
  getUsers,
  updateUser,
  type User,
  type UserProperty,
} from "../users";
import ActionButtons from "../components/ActionButtons";

const { Title } = Typography;
const { Column } = Table;

const UsersTable: React.FC = () => {
  const [data, setData] = useState<User[]>();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const { current: currentPage } = pagination;

  const fetchData = () => {
    // TODO: Manejo de errores
    setLoading(true);
    getUsers(currentPage).then(({ results, totalCount }) => {
      setData(results);
      setLoading(false);
      setPagination((prev) => ({ ...prev, total: totalCount }));
    });
  };

  useEffect(fetchData, [currentPage]);

  return (
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
        onChange={(pagination) => setPagination(pagination)}
        style={{ width: "100%" }}
        scroll={{ x: "max-content" }}
      >
        <Column<User>
          title="ID"
          dataIndex="id"
          key="id"
          width="10%"
          sorter={(a, b) => a.id - b.id}
          {...getColumnSearchProps("id")}
        />

        <Column<User>
          title="Name"
          dataIndex="name"
          key="name"
          width="30%"
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
          width="30%"
          sorter={(a, b) => a.email.localeCompare(b.email)}
          {...getColumnSearchProps("email")}
        />

        <Column<User>
          title="Action"
          dataIndex="action"
          key="action"
          width="30%"
          render={(_, record) => (
            <ActionButtons
              onEdit={() => openUserEditModal(record, fetchData)}
              onDelete={() => openUserDeleteModal(record.id, fetchData)}
            />
          )}
        />
      </Table>
    </Flex>
  );
};

// NOTE: Función para obtener las props necesarias para la funcionalidad de filtrado
const getColumnSearchProps = (
  dataIndex: UserProperty,
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

const openUserDeleteModal = (id: number, onSucess: () => void) => {
  Modal.confirm({
    title: "¿Quieres eliminar este usuario?",
    okText: "Eliminar",
    okButtonProps: { variant: "solid", color: "danger" },
    cancelText: "Cancelar",
    onOk: async () => {
      const ok = await deleteUser(id);
      if (ok) {
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
          const ok = await updateUser({ ...user, ...values });
          if (ok) {
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

export default UsersTable;
