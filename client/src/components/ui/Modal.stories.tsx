import { useEffect } from 'react';
import { Modal, ModalProps } from './Modal';
import type { Meta, StoryObj } from '@storybook/react';
import { useModal } from '@/hooks/useModal';

type Story = StoryObj<typeof Modal>;

export default {
  title: 'components/ui/Modal',
  component: Modal,
  argTypes: {
    title: {
      control: 'text',
      description: '모달 제목',
      defaultValue: '예시 모달',
    },
    isModalOpened: {
      control: 'boolean',
      description: '모달 열림/닫힘 상태',
    },
    closeModal: {
      description: '모달 닫는 함수',
      action: 'closed',
    },
    handleKeyDown: {
      description: '키보드 이벤트 처리 함수',
      action: 'closed',
    },
    children: {
      control: 'text',
      description: '모달 내부 컨텐츠',
      defaultValue: '모달 내용입니다. 배경을 클릭하거나 focusing된 상태에서 ESC 키로 닫을 수 있습니다.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          '사용자에게 정보를 표시하거나 작업을 수행하기 위한 모달 컴포넌트입니다. <br/><br/> 모달 열기 버튼을 누르면 모달이 뜹니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

const DefaultModalExample = (args: ModalProps) => {
  const { isModalOpened, openModal, closeModal, handleKeyDown } = useModal();

  useEffect(() => {
    if (args.isModalOpened && !isModalOpened) openModal();
    else if (!args.isModalOpened && isModalOpened) closeModal();
  }, [args.isModalOpened]);

  return (
    <div>
      <button onClick={openModal}>모달 열기 버튼</button>
      <Modal {...args} isModalOpened={isModalOpened} closeModal={closeModal} handleKeyDown={handleKeyDown} />
    </div>
  );
};

const AutoCloseModalExample = (args: ModalProps) => {
  const { isModalOpened, openModal } = useModal(3000);

  return (
    <div>
      <button onClick={openModal}>3초 후 자동으로 닫히는 모달 열기 버튼</button>
      <Modal {...args} isModalOpened={isModalOpened}>
        <p>이 모달은 3초 후에 자동으로 닫힙니다.</p>
      </Modal>
    </div>
  );
};

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '기본적인 모달 사용 예시입니다. 모달은 overlay를 클릭하거나, overlay나 모달이 focusing 됐을 때 ESC 키로 닫을 수 있습니다.',
      },
    },
  },
  args: {
    title: 'default Modal',
  },
  render: (args) => <DefaultModalExample {...args} />,
};

export const AutoClose: Story = {
  parameters: {
    docs: {
      description: {
        story: '3초 후 자동으로 닫히는 모달 예시입니다.',
      },
    },
  },
  args: {
    title: 'AutoClose Modal',
  },
  render: (args) => <AutoCloseModalExample {...args} />,
};
