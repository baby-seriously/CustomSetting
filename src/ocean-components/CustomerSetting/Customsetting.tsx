import { useRef, type JSX } from 'react';
import { Modal, Alert, type ModalProps } from 'antd';
import { CustomsettingSettingInner, type CustomsettingSettingInnerRef } from './content';
import { useCustomerSetting } from './hooks/useCustomSetting';
import style from './style.module.less';
// 从 hook 中获取 Props 类型
export type CustomsettingSettingProps = Parameters<typeof useCustomerSetting>[0] & {
  visible: boolean;
  onCancel?: () => void;
  onSaveSuccess?: () => void; // 保存成功后的回调
  modalProps?: ModalProps; // 使用antd Modal的props类型
  showTips?: boolean;
};

// 这是完整的Props类型，必须包含
// - storageKey: string
// - systemFields: SystemField[] 或 getSystemFields: () => Promise<SystemField[]>
export function CustomsettingSetting(props: CustomsettingSettingProps): JSX.Element {
  const { visible, onCancel, onSaveSuccess, modalProps, showTips, ...hookProps } = props;

  // 创建 ref 来调用内部组件的 保存 方法
  const innerRef = useRef<CustomsettingSettingInnerRef>(null);

  const handleOk = async () => {
    const success = await innerRef.current?.onSave();
    if (success) {
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      if (onCancel) {
        onCancel();
      }
    }
  };

  return (
    <Modal
      className={style.modal}
      open={visible}
      width={900}
      title="自定义列"
      okText="保存"
      {...modalProps}
      onOk={handleOk}
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
      {/* 将 hook 需要的 props 和 ref 传递给内部组件 */}
      <CustomsettingSettingInner {...hookProps} ref={innerRef} />
    </Modal>
  );
}