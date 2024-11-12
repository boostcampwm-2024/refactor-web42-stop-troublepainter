import { Input } from './Input';

export default {
  title: 'components/ui/Input',
  component: Input,
  argTypes: {
    label: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
  },
};

export const Default = {
  args: {
    label: 'Default Label',
    placeholder: 'Default placeholder',
  },
};
