import {
  Burger,
  Header as HeaderComponent,
  MediaQuery,
  useMantineTheme,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

import { NavMenu } from '../../lib/navItem';
import Logo from './Logo';
import MenuButton from './MenuButton';
import ProfileMenu from './ProfileMenu';

interface HeaderProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  navItems: NavMenu;
  names: string[];
}

const Header = ({ opened, setOpened, navItems, names }: HeaderProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const state = router.query.state as string;

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
        <MediaQuery largerThan={734} styles={{ display: 'none' }}>
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
          <MediaQuery smallerThan={735} styles={{ display: 'none' }}>
            <div>
              {state ? (
                <span>
                  {navItems.common.map((item) => {
                    return (
                      <MenuButton
                        key={`${state}/${item.url}`}
                        {...item}
                        url={`${state}/${item.url}`}
                      />
                    );
                  })}
                  {navItems[state] && navItems[state].map((item) => {
                    return <MenuButton key={item.url} {...item} />;
                  })}
                </span>
              ) : (
                navItems.common.map((item) => {
                  return <MenuButton key={item.url} {...item} />;
                })
              )}
            </div>
          </MediaQuery>
        </div>

        <ProfileMenu names={names} />
      </div>
    </HeaderComponent>
  );
};

export default Header;
