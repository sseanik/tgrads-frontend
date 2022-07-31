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

interface LoginModalCruiseProps {
  openedCruise: boolean;
  setOpenedCruise: Dispatch<SetStateAction<boolean>>;
}

const LoginModalCruise = (props: LoginModalCruiseProps) => {
  const router = useRouter();
  // Loading overlay state
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '@team.telstra.com',
      password: '',
    },
    // Validate email is valid and password minimum length
    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : 'Invalid email',
      password: (value: string) =>
        value.length >= 3 ? null : 'Password must be at least 3 characters',
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // If the form's validation is successful
    if (!form.validate().hasErrors) {
      setLoading(true);
      // Attempt to sign in
      const result = await signIn('credentials', {
        redirect: false,
        email: form.values.email,
        password: form.values.password,
      });

      if (result?.ok) {
        // Sign in successful
        router.replace('/cruise');
        props.setOpenedCruise(false);
      } else {
        // Sign in failed
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
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={props.openedCruise}
      onClose={() => props.setOpenedCruise(false)}
      title={
        <Text weight={700} size='lg'>
          Cruise Login
        </Text>
      }
      size='md'
    >
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
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
