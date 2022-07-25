import { ActionIcon, Box, Text } from '@mantine/core';
import { BrandGithub, BrandLinkedin, Code } from 'tabler-icons-react';

const Footer = () => {
  return (
    <Box
      sx={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
      }}
    >
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <Code color={'#888e96'} />
        <Text color='dimmed' size='sm'>
          Built by{' '}
        </Text>
        <Text color='violet'>Sean Smith</Text>
      </span>
      <div style={{ display: 'flex', gap: 10 }}>
        <ActionIcon
          size='lg'
          variant='light'
          component='a'
          href='https://github.com/sseanik'
          target='_blank'
        >
          <BrandGithub />
        </ActionIcon>
        <ActionIcon
          size='lg'
          variant='light'
          component='a'
          href='https://www.linkedin.com/in/seaniksmith'
          target='_blank'
        >
          <BrandLinkedin />
        </ActionIcon>
      </div>
    </Box>
  );
};

export default Footer;
