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

const LoginModal = (props: LoginModalProps) => {
  // Error state when login fails
  const [error, setError] = useState<boolean>(false);
  // Get all Full Names from grads
  const names = props.grads.map((grad) => grad.attributes.FullName);
  // Only suggest names when user inputs 2 characters or more
  const minData: string[] = props.value.length >= 2 ? names : [];

  const loginClick = (): void => {
    // If inputted name is not in the grad names list, set error
    if (!names.includes(props.value)) {
      setError(true);
    } else {
      // Find the grad in the grads array that matches their full name
      const foundGrad = props.grads.find(
        (grad) => grad.attributes.FullName === props.value
      )?.attributes;
      // If not found set error
      if (!foundGrad) {
        setError(true);
        return;
      }
      // Remove the typename key for local storage purposes
      delete foundGrad['__typename'];
      // Set TGA field if missing
      if (foundGrad.TGA === null) foundGrad.TGA = false;
      // Set the logged in local storage state
      props.setLoggedIn(JSON.stringify(foundGrad));
      // Close the modal
      props.setOpened(false);
    }
  };

  // When user key downs or backspaces, update value and error states
  const changeValue = (name: string): void => {
    props.setValue(name);
    setError(false);
  };

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.setOpened(false)}
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
        value={props.value}
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
