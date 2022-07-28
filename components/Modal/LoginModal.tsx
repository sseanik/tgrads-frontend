import { Autocomplete, Button, Center, Modal, Text } from '@mantine/core';
import { Dispatch, SetStateAction, useState } from 'react';
import { MoodHappy, MoodSad } from 'tabler-icons-react';

import { Grad } from '../../types/User';

interface LoginModalProps {
  value: string;
  opened: boolean;
  grads: Grad[];
  setLoggedIn: (value: string) => void;
  setOpened: Dispatch<SetStateAction<boolean>>;
  setValue: Dispatch<SetStateAction<string>>;
}

const LoginModal = ({
  grads,
  value,
  opened,
  setLoggedIn,
  setOpened,
  setValue,
}: LoginModalProps) => {
  const [error, setError] = useState<boolean>(false);

  const names = grads.map((grad) => grad.attributes.FullName);
  const minData: string[] = value.length >= 1 ? names : [];

  const loginClick = (): void => {
    if (!names.includes(value)) {
      setError(true);
    } else {
      const foundGrad = grads.find(
        (grad) => grad.attributes.FullName === value
      )?.attributes;
      if (!foundGrad) {
        setError(true);
        return;
      }
      delete foundGrad['__typename'];
      if (foundGrad.TGA === null) foundGrad.TGA = false;
      setLoggedIn(JSON.stringify(foundGrad));
      setOpened(false);
    }
  };

  const changeValue = (name: string): void => {
    setValue(name);
    setError(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Text weight={700} size='lg'>
          Login
        </Text>
      }
      size='md'
    >
      <Autocomplete
        description='We use your name to login, no need to register'
        label='What is your name?'
        required
        data={minData}
        value={value}
        onChange={changeValue}
        size='md'
        radius='md'
        icon={error ? <MoodSad /> : <MoodHappy />}
        limit={3}
        error={error ? 'Name not found in Grad Program' : ''}
        filter={(value, item) =>
          item.value.toLowerCase().startsWith(value.toLowerCase())
        }
      />
      <Center>
        <Button
          size='md'
          mt={16}
          onClick={loginClick}
          style={{ width: '100%' }}
        >
          Login
        </Button>
      </Center>
    </Modal>
  );
};

export default LoginModal;
