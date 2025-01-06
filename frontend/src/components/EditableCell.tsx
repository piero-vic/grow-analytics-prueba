import { Form, Input, Select } from "antd";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "text" | "select";
  options?: string[];
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  options = [],
  ...restProps
}) => {
  if (!editing) {
    return <td {...restProps}>{children}</td>;
  }

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
    </td>
  );
};

export default EditableCell;
