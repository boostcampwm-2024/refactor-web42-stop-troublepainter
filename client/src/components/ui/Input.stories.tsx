import { Input } from './Input';

export default {
  title: 'components/ui/Input',
  component: Input,
  argTypes: {
    label: {
      control: 'text',
      description: 'The label displayed above the input field.',
      defaultValue: 'Label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed inside the input field.',
      defaultValue: 'Enter text...',
    },
  },
};

export const Default = {
  args: {
    label: 'Default Label',
    placeholder: 'Default placeholder',
  },
};
