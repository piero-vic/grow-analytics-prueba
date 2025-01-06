import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
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
import {
  deleteUser,
  getUsers,
  updateUser,
  type User,
  type UserProperty,
} from "../users";
import ActionButtons from "../components/ActionButtons";
import EditableCell from "../components/EditableCell";

const { Title } = Typography;
const { Column } = Table;

const UsersEditTable: React.FC = () => {
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

  // NOTE: Función para obtener las props necesarias para la funcionalidad de filtrado
  const getColumnCellProps = (
    dataIndex: UserProperty,
  ): TableColumnType<User> => {
    return {
      onCell: (record) => ({
        editing: isEditing(record),
        dataIndex: dataIndex,
        title: dataIndex,
        inputType: dataIndex === "userType" ? "select" : "text",
        options: dataIndex === "userType" ? ["ADMIN", "USER"] : [],
      }),
    };
  };

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

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number | null>();

  const isEditing = (record: User) => record.id === editingKey;

  const edit = (record: User) => {
    form.setFieldsValue(record);
    setEditingKey(record.id);
  };

  const save = async (user: User) => {
    try {
      const values = (await form.validateFields()) as Omit<User, "id">;
      const ok = await updateUser({ ...user, ...values });
      if (ok) {
        fetchData();
        setEditingKey(null);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  return (
    <Form form={form} component={false}>
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
              onChange={(pagination) => setPagination(pagination)}
              style={{ width: "100%" }}
              scroll={{ x: "max-content" }}
              components={{ body: { cell: EditableCell } }}
            >
              <Column<User>
                title="ID"
                dataIndex="id"
                width="10%"
                key="id"
                sorter={(a, b) => a.id - b.id}
                {...getColumnSearchProps("id")}
              />

              <Column<User>
                title="Username"
                dataIndex="username"
                width="30%"
                key="username"
                sorter={(a, b) => a.username.localeCompare(b.username)}
                {...getColumnSearchProps("username")}
                {...getColumnCellProps("username")}
              />

              <Column<User>
                title="Tipo de usuario"
                dataIndex="userType"
                width="30%"
                key="userType"
                sorter={(a, b) => a.userType.localeCompare(b.userType)}
                {...getColumnSearchProps("userType")}
                {...getColumnCellProps("userType")}
              />

              <Column<User>
                title="Action"
                dataIndex="action"
                width="30%"
                key="action"
                render={(_, record) => (
                  <ActionButtons
                    editing={isEditing(record)}
                    onSave={() => save(record)}
                    onCancel={() => setEditingKey(null)}
                    onEdit={() => edit(record)}
                    onDelete={() => openUserDeleteModal(record.id, fetchData)}
                  />
                )}
              />
            </Table>
          </Flex>
        </Layout.Content>
      </Layout>
    </Form>
  );
};

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

export default UsersEditTable;
