import { Button } from './Button';
import helpIcon from '@/assets/help-icon.svg';

export default {
  component: Button,
  title: 'components/ui/Button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'transperent'],
    },
    size: {
      control: 'select',
      options: ['text', 'icon'],
    },
    disabled: { control: 'boolean' },
    children: {
      control: 'text',
    },
  },
  args: {
    children: 'Button',
  },
};

export const Primary = {
  args: {
    variant: 'primary',
    size: 'text',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    size: 'text',
  },
};

export const Transparent = {
  args: {
    variant: 'transperent',
    size: 'icon',
    children: <img src={helpIcon} alt="Help Icon" />,
  },
};

export const Disabled = {
  args: {
    variant: 'primary',
    size: 'text',
    disabled: true,
  },
};
