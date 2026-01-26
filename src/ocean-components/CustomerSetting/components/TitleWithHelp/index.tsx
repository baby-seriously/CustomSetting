import React from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface TitleWithHelpProps {
  title: React.ReactNode;
  help: string;
  placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
}

export const TitleWithHelp: React.FC<TitleWithHelpProps> = ({ title, help, placement = 'top' }) => {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {title}
      <Tooltip title={help} placement={placement}>
        <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
      </Tooltip>
    </span>
  );
};