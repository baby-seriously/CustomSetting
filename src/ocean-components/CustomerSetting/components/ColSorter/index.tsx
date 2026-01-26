import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HamburgerButton, Close, Lock } from '@icon-park/react';
import { Button } from 'antd';
import type { CustomField } from '../../hooks/useCustomSetting';

import style from './style.module.less';

interface SortableItemProps {
  field: CustomField;
  index: number;
  onRemove: (key: string) => void;
}

function SortableItem({ field, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.field,
  });

  const styleProps = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? '#d7d7d9' : '#f8f8f9',
  };

  return (
    <div className={style.dragItem} ref={setNodeRef} style={styleProps}>
      <div {...attributes} {...listeners}>
        <HamburgerButton theme="outline" size="14" fill="#333" />
        <div className={style.label}>{field.label}</div>
      </div>
      <Close
        theme="outline"
        size="8"
        fill="#323335"
        style={{ cursor: 'pointer' }}
        onClick={() => onRemove(field.field)}
      />
    </div>
  );
}

export interface ColSorterProps {
  fields: CustomField[];
  selectedFields: CustomField[];
  dragValues: CustomField[];
  fixedValues: CustomField[];
  maxSelectedCount?: number;
  onFieldsChange: (value: CustomField[]) => void;
  onRemoveFields: (fieldKeys: string[]) => void;
  onReorderFields: (sourceIndex: number, destinationIndex: number) => void;
  onReset?: () => void;
}

export default function ColSorter({
  selectedFields,
  dragValues,
  fixedValues,
  maxSelectedCount = 16,
  onRemoveFields,
  onReorderFields,
  onReset,
}: ColSorterProps): React.ReactElement {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = dragValues.findIndex(item => item.field === active.id);
      const newIndex = dragValues.findIndex(item => item.field === over.id);

      const sourceField = dragValues[oldIndex];
      const destinationField = dragValues[newIndex];

      const sourceCanCrossGroup = sourceField.groups?.some(group => group.dragScope === true);
      const destinationCanCrossGroup = destinationField.groups?.some(group => group.dragScope === true);

      const sourceGroupPath = sourceField.groups?.map(group => group.title).join('/') || '';
      const destinationGroupPath = destinationField.groups?.map(group => group.title).join('/') || '';

      if (sourceGroupPath !== destinationGroupPath) {
        if (!sourceCanCrossGroup || !destinationCanCrossGroup) {
          console.log('wgr drag prevented: field without dragScope cannot cross group boundaries', {
            field: sourceField.field,
            sourceGroup: sourceGroupPath,
            destinationGroup: destinationGroupPath,
            sourceCanCrossGroup,
            destinationCanCrossGroup,
          });
          return;
        }
      }

      onReorderFields(oldIndex, newIndex);
    }
  };

  const handleRemove = (key: string) => {
    onRemoveFields([key]);
  };

  return (
    <div className={style.colSorter}>
      <div className={style.header}>
        <span>
          已添加 ({selectedFields.length}/{maxSelectedCount})
        </span>
        <span>
          <Button type="link" onClick={onReset}>
            重置
          </Button>
        </span>
      </div>
      <div className={style.sortContent}>
        {fixedValues.length > 0 && (
          <div className={style.fixedContent}>
            <div className={style.fixedContentInner}>
              {fixedValues.map(field => (
                <div className={style.fixedItem} key={field.field}>
                  <div>
                    <Lock theme="outline" size="14" fill="#333" />
                    <div className={style.label}>{field.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={style.tips}>以上指标横向固定，最多5个</div>
          </div>
        )}

        <div className={style.dragContent}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleOnDragEnd}>
            <SortableContext items={dragValues.map(item => item.field)} strategy={verticalListSortingStrategy}>
              {dragValues.map((field, index) => (
                <SortableItem key={field.field} field={field} index={index} onRemove={handleRemove} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}