import React from 'react';
import { Modal, Alert, type ModalProps } from 'antd';
import { CustomsettingSettingInner } from './content';
import { type CustomField } from './hooks/useCustomSetting';
import style from './style.module.less';

export type CustomsettingSettingProps = {
  visible: boolean;
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
  onCancel?: () => void;
  onSave: () => Promise<void>;
  modalProps?: ModalProps; // 使用antd Modal的props类型
  showTips?: boolean;
  maxSelectedCount?: number;
};

export function CustomsettingSetting(props: CustomsettingSettingProps): React.ReactElement {
  const { visible, fields, onChange, onCancel, onSave, modalProps, showTips, maxSelectedCount } = props;

  return (
    <Modal
      className={style.modal}
      open={visible}
      width={900}
      title="自定义列"
      okText="保存"
      cancelText="取消"
      {...modalProps}
      onOk={onSave}
      onCancel={onCancel}
    >
      {showTips && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
          title="若调整字段顺序，同组其他字段顺序将同步被调整"
        />
      )}
      {/* 将字段和回调传递给内部组件 */}
      <CustomsettingSettingInner
        fields={fields}
        onChange={onChange}
        maxSelectedCount={maxSelectedCount}
      />
    </Modal>
  );
}