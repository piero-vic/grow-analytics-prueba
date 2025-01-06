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
  Select,
  type TableColumnType,
  type TablePaginationConfig,
} from "antd";

const { Title } = Typography;
const { Column } = Table;

type User = {
  id: number;
  username: string;
  email: string;
  userType: "USER" | "ADMIN";
  name: string;
  paternalLastName: string;
  maternalLastName: string;
};

type DataIndex = keyof User;

const UsersEditTable: React.FC = () => {
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
    onCell: (record: User) => ({
      record,
      inputType: dataIndex === "userType" ? "select" : "text",
      options: dataIndex === "userType" ? ["ADMIN", "USER"] : [],
      dataIndex: dataIndex,
      title: dataIndex,
      // NOTE: El ID no puede ser editado porque es el identificador de usuario
      editing: dataIndex === "id" ? false : isEditing(record),
    }),
  });

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number | null>();
  const isEditing = (record: User) => record.id === editingKey;

  const edit = (record: User) => {
    form.setFieldsValue(record);
    setEditingKey(record.id);
  };

  const save = async (record: User) => {
    try {
      const user = (await form.validateFields()) as Omit<User, "id">;

      const res = await fetch(`http://localhost:3000/users/${record.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...record, ...user }),
        headers: new Headers({ "content-type": "application/json" }),
      });

      if (res.ok) {
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
              onChange={(pagination) => {
                setPagination(pagination);
              }}
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
              />

              <Column<User>
                title="Tipo de usuario"
                dataIndex="userType"
                width="30%"
                key="userType"
                sorter={(a, b) => a.userType.localeCompare(b.userType)}
                {...getColumnSearchProps("userType")}
              />

              <Column<User>
                title="Action"
                dataIndex="action"
                width="30%"
                key="action"
                render={(_, record) => {
                  const editing = isEditing(record);

                  if (editing) {
                    return (
                      <Space size="small">
                        <Button
                          size="small"
                          variant="link"
                          color="primary"
                          onClick={() => save(record)}
                        >
                          Guardar
                        </Button>
                        <Button
                          size="small"
                          variant="link"
                          color="danger"
                          onClick={() => setEditingKey(null)}
                        >
                          Cancelar
                        </Button>
                      </Space>
                    );
                  }

                  return (
                    <Space size="middle">
                      <Button
                        variant="outlined"
                        color="primary"
                        icon={<EditFilled />}
                        onClick={() => edit(record)}
                      />
                      <Button
                        variant="outlined"
                        color="danger"
                        icon={<DeleteFilled />}
                        onClick={() =>
                          openUserDeleteModal(record.id, fetchData)
                        }
                      />
                    </Space>
                  );
                }}
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
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onSucess();
      }
    },
  });
};

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "text" | "select";
  options?: string[];
  record: User;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options = [],
  ...restProps
}) => {
  const inputNode =
    inputType === "select" ? (
      <Select
        options={options.map((option) => ({ value: option, label: option }))}
      />
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default UsersEditTable;
