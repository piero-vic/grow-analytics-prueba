import { useEffect, useState } from "react";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import {
  Layout,
  Flex,
  Typography,
  Table,
  Space,
  Button,
  type GetProp,
  type TableProps,
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

  const deleteUser = async (id: number) => {
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchData();
    }
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
            <Column
              title="ID"
              dataIndex="id"
              key="id"
              sorter={(a, b) => a.id - b.id}
            />
            <Column
              title="Email"
              dataIndex="email"
              key="email"
              sorter={(a, b) => (a.email > b.email ? 1 : 0)}
            />
            <Column
              title="Name"
              dataIndex="name"
              key="name"
              sorter={(a, b) => (a.name > b.name ? 1 : 0)}
              render={(_, record) =>
                `${record.name} ${record.paternalLastName} ${record.maternalLastName}`
              }
            />
            <Column
              title="Action"
              dataIndex="action"
              key="action"
              render={(_, record) => (
                <Space size="middle">
                  <Button
                    variant="outlined"
                    color="primary"
                    icon={<EditFilled />}
                    onClick={() => {
                      // TODO: Agregar modal para editar usuario
                      alert("Agregar modal para editar usuario");
                    }}
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
