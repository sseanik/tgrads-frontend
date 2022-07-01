import {
  Burger,
  Header as HeaderComponent,
  MediaQuery,
  useMantineTheme,
} from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';

import NavItems from '../assets/NavItems';
import Logo from './Logo';
import MenuButton from './MenuButton';
import ProfileMenu from './ProfileMenu';

interface HeaderProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  names: string[];
}

const Header = ({ opened, setOpened, names }: HeaderProps) => {
  const theme = useMantineTheme();

  return (
    <HeaderComponent height={70} p='md' style={{ padding: '0 16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <MediaQuery largerThan='xs' styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((open: boolean) => !open)}
            size='sm'
            color={theme.colorScheme === 'dark' ? '#efefff' : '#3c4394'}
            mr='xl'
          />
        </MediaQuery>

        <Logo />

        <div style={{ flex: 1, display: 'flex', height: '100%' }}>
          <MediaQuery smallerThan='xs' styles={{ display: 'none' }}>
            <div>
              {NavItems.map((item) => {
                return <MenuButton key={item.url} {...item} />;
              })}
            </div>
          </MediaQuery>
        </div>

        <ProfileMenu names={names} />
      </div>
    </HeaderComponent>
  );
};

export default Header;
