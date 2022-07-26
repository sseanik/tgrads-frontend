import { Accordion, Badge, Card, Group, Text } from '@mantine/core';
import { Cake } from 'tabler-icons-react';

import { Grad } from '../../types/User';
import { filterBirthdays } from '../../utils/filterBirthdays';

interface BirthdaysProps {
  month: string;
  grads: Grad[];
}

const Birthdays = ({ month, grads }: BirthdaysProps) => {
  const colours = {
    NSW: 'blue',
    QLD: 'red',
    ACT: 'green',
    WA: 'orange',
    VIC: 'indigo',
    SA: 'yellow',
  };

  const { birthdayGradsA, birthdayGradsB } = filterBirthdays(grads, month);

  return (
    <Card shadow='sm' p={0} mb={8}>
      <Accordion
        initialItem={0}
        iconPosition='right'
        styles={{
          label: { fontWeight: 700 },
        }}
      >
        <Accordion.Item
          m={0}
          label={
            <Group noWrap>
              <Cake size={22} />
              <div>
                <Text>Birthdays</Text>
                <Text size='sm' color='dimmed' weight={400}>
                  Celebrating Past and Upcoming Birthdays
                </Text>
              </div>
            </Group>
          }
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 12,
            }}
          >
            {birthdayGradsA.map((bday) => {
              return (
                <Badge
                  variant='dot'
                  color={colours[bday.attributes.State]}
                  size='lg'
                  sx={{ padding: 10, marginRight: 4, textTransform: 'none' }}
                  key={bday.attributes.FullName}
                >
                  {bday.attributes.FullName}
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
            {birthdayGradsB.map((bday) => {
              return (
                <Badge
                  variant='dot'
                  color={colours[bday.attributes.State]}
                  size='lg'
                  sx={{ padding: 10, marginRight: 4, textTransform: 'none' }}
                  key={bday.attributes.FullName}
                >
                  {bday.attributes.FullName}
                </Badge>
              );
            })}
          </div>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};

export default Birthdays;
