import {
  Button,
  Center,
  Modal,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';

interface LoginModalNSWProps {
  openedCruise: boolean;
  setOpenedCruise: Dispatch<SetStateAction<boolean>>;
}

const LoginModalCruise = ({
  openedCruise,
  setOpenedCruise,
}: LoginModalNSWProps) => {
  const router = useRouter();


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
      const result = await signIn('credentials', {
        redirect: false,
        email: form.values.email,
        password: form.values.password,
      });
  
      if (result?.ok) {
        alert('Credential are good');
        router.replace("/cruise")
        setOpenedCruise(false);
      } else {
        alert('Credential is not valid');
      }
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
          <Button size='md' mt={16} style={{ width: '100%' }} type="submit">
            Login
          </Button>
        </Center>
      </form>
    </Modal>
  );
};

export default LoginModalCruise;
