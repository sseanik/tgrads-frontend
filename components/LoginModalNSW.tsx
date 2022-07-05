import { Autocomplete, Button, Center, Modal, Text } from '@mantine/core';
import { Dispatch, SetStateAction, useState } from 'react';
import { MoodHappy, MoodSad } from 'tabler-icons-react';

interface LoginModalNSWProps {
  valueNSW: string;
  openedNSW: boolean;
  names: string[];
  setLoggedInNSW: (value: string) => void;
  setOpenedNSW: Dispatch<SetStateAction<boolean>>;
  setValueNSW: Dispatch<SetStateAction<string>>;
}

const LoginModalNSW = ({
  names,
  valueNSW,
  openedNSW,
  setLoggedInNSW,
  setOpenedNSW,
  setValueNSW,
}: LoginModalNSWProps) => {
  const [error, setError] = useState<boolean>(false);

  const minData: string[] = valueNSW.length >= 1 ? names : [];

  const loginClick = (): void => {
    if (!names.includes(valueNSW)) {
      setError(true);
    } else {
      setLoggedInNSW(valueNSW);
      setOpenedNSW(false);
    }
  };

  const changeValue = (name: string): void => {
    setValueNSW(name);
    setError(false);
  };

  return (
    <Modal
      opened={openedNSW}
      onClose={() => setOpenedNSW(false)}
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
        value={valueNSW}
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

export default LoginModalNSW;
