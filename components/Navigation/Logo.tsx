import { Button, Text, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Logo = () => {
  // Theme to determine the current color mode
  const theme = useMantineTheme();
  // Router to get the state from the current URL
  const router = useRouter();
  const state = router.query.state as string;

  return (
    <Link href='/'>
      <a style={{ height: '100%' }}>
        <Button
          styles={() => ({
            root: {
              height: '100%',
              padding: 0,
              '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? '#242936' : '',
              },
            },
          })}
          radius='xs'
          variant='subtle'
          color='indigo'
          size='md'
        >
          <div
            style={{
              backgroundImage:
                'linear-gradient(45deg,  #9546c1 20%, #5a46c1 40%, #5b6cf4 60%)',
              width: '50px',
              height: '30px',
              marginRight: '6px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: 'rotate(40deg)',
              borderRadius: '50%',
            }}
          >
            <p
              style={{
                color: theme.colorScheme === 'dark' ? '#1a1b1e' : 'white',
                fontSize: '36pt',
                fontWeight: 'bold',
                transform: 'rotate(-40deg)',
                padding: '18px 0 0 8px',
              }}
            >
              T
            </p>
          </div>
          <Text
            size='xl'
            weight={700}
            style={{
              marginLeft: 'auto',
              marginRight: '6px',
              backgroundColor:
                theme.colorScheme === 'dark' ? '#fff' : '#5b6cf4',
              backgroundSize: '100%',
              backgroundRepeat: 'repeat',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation:
                'rainbow-text-simple-animation-rev 0.75s ease forwards',
            }}
          >
            {`${state ? state.toUpperCase() : 'T'} Grads`}
          </Text>
        </Button>
      </a>
    </Link>
  );
};

export default Logo;
