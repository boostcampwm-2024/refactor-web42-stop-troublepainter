import { useState, useEffect } from 'react';
import Dropdown, { DropdownProps } from './Dropdown';
import type { Meta, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof Dropdown>;

const sampleOptions = [
  { id: 1, value: '옵션 1' },
  { id: 2, value: '옵션 2' },
  { id: 3, value: '옵션 3' },
  { id: 4, value: '옵션 4' },
];

export default {
  title: 'components/ui/Dropdown',
  component: Dropdown,
  argTypes: {
    options: {
      control: 'object',
      description: '드롭다운에 표시될 옵션 목록',
    },
    selectedValue: {
      control: 'select',
      options: sampleOptions.map((option) => option.value),
      description: '현재 선택된 값',
    },
    handleChange: {
      description: '값이 변경될 때 호출되는 함수',
      action: 'changed',
    },
    className: {
      control: 'text',
      description: '추가 스타일링',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          '사용자가 여러 옵션 중 하나를 선택할 수 있는 드롭다운 컴포넌트입니다.<br/><br/>드롭다운을 클릭하고 옵션을 선택해보세요.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

const DefaultExample = (args: DropdownProps) => {
  const [selectedValue, setSelectedValue] = useState(args.selectedValue);

  useEffect(() => {
    setSelectedValue(args.selectedValue);
  }, [args.selectedValue]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    args?.handleChange(value);
  };

  return <Dropdown {...args} selectedValue={selectedValue} handleChange={handleChange} />;
};

export const Default: Story = {
  args: {
    options: sampleOptions,
    selectedValue: sampleOptions[0].value,
  },
  render: (args) => <DefaultExample {...args} />,
};
