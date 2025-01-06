import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Space, Button } from "antd";

type Props = {
  editing?: boolean;
  onSave?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
};

const ActionButtons: React.FC<Props> = ({
  editing = false,
  onSave,
  onEdit,
  onDelete,
  onCancel,
}) => {
  if (editing) {
    return (
      <Space size="small">
        <Button
          size="small"
          variant="link"
          color="primary"
          onClick={() => onSave?.()}
        >
          Guardar
        </Button>
        <Button
          size="small"
          variant="link"
          color="danger"
          onClick={() => onCancel?.()}
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
        onClick={() => onEdit?.()}
      />
      <Button
        variant="outlined"
        color="danger"
        icon={<DeleteFilled />}
        onClick={() => onDelete?.()}
      />
    </Space>
  );
};

export default ActionButtons;
