import { Accordion, Badge, Card, Group, Text } from '@mantine/core';
import { Cake } from 'tabler-icons-react';

import { STATE_COLOURS } from '../../assets/stateColours';
import { Grad } from '../../types/User';
import { filterBirthdaysOnStarSign } from '../../utils/birthdayUtil';

interface BirthdaysProps {
  month: string;
  grads: Grad[];
}

const Birthdays = ({ month, grads }: BirthdaysProps) => {

  // Filter birthdays on month's possible star signs (e.g. 'cancer' & 'gemini')
  const { birthdayGradsA, birthdayGradsB } = filterBirthdaysOnStarSign(
    grads,
    month
  );

  return (
    <Card shadow='sm' p={0} mb={8}>
      <Accordion
        defaultValue='birthdays-0'
        styles={{
          label: { fontWeight: 700 },
        }}
      >
        <Accordion.Item m={0} value='birthdays-0'>
          <Accordion.Control>
            <Group noWrap>
              <Cake size={22} />
              <div>
                <Text>Birthdays</Text>
                <Text size='sm' color='dimmed' weight={400}>
                  Celebrating Past and Upcoming Birthdays
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 12,
              }}
            >
              {birthdayGradsA.map((gradBirthday) => {
                return (
                  <Badge
                    variant='dot'
                    color={STATE_COLOURS[gradBirthday.attributes.State]}
                    size='lg'
                    sx={{ padding: 10, marginRight: 4, textTransform: 'none' }}
                    key={gradBirthday.attributes.FullName}
                  >
                    {gradBirthday.attributes.FullName}
                  </Badge>
                );
              })}
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              {birthdayGradsB.map((gradBirthday) => {
                return (
                  <Badge
                    variant='dot'
                    color={STATE_COLOURS[gradBirthday.attributes.State]}
                    size='lg'
                    sx={{ padding: 10, marginRight: 4, textTransform: 'none' }}
                    key={gradBirthday.attributes.FullName}
                  >
                    {gradBirthday.attributes.FullName}
                  </Badge>
                );
              })}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};

export default Birthdays;
