import {
  Button,
  Center,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { AlertCircle } from 'tabler-icons-react';

interface LoginModalNSWProps {
  openedCruise: boolean;
  setOpenedCruise: Dispatch<SetStateAction<boolean>>;
}

const LoginModalCruise = ({
  openedCruise,
  setOpenedCruise,
}: LoginModalNSWProps) => {
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : 'Invalid email',
      password: (value: string) =>
        value.length >= 3 ? null : 'Password must be at least 3 characters',
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.validate().hasErrors) {
      setVisible(true);
      const result = await signIn('credentials', {
        redirect: false,
        email: form.values.email,
        password: form.values.password,
      });

      if (result?.ok) {
        router.replace('/cruise');
        setOpenedCruise(false);
      } else {
        console.log(result);
        showNotification({
          id: 'login-error',
          title: 'Error',
          message: `Login Failed${
            result?.error === 'CredentialsSignin'
              ? ': Invalid email or password'
              : ''
          }`,
          autoClose: 3000,
          color: 'red',
          icon: <AlertCircle />,
        });
      }
      setVisible(false);
    }
  };

  return (
    <Modal
      opened={openedCruise}
      onClose={() => setOpenedCruise(false)}
      title={
        <Text weight={700} size='lg'>
          Cruise Login
        </Text>
      }
      size='md'
    >
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={visible} />
        <form onSubmit={onSubmit}>
          <TextInput
            required
            label='Email'
            placeholder='@team.telstra.com'
            {...form.getInputProps('email')}
            mb={10}
          />
          <PasswordInput
            required
            label='Password'
            {...form.getInputProps('password')}
          />
          <Center>
            <Button size='md' mt={16} style={{ width: '100%' }} type='submit'>
              Login
            </Button>
          </Center>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModalCruise;
