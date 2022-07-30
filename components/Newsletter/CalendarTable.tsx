import { Accordion, Card, Group, Table, Text } from '@mantine/core';
import format from 'date-fns/format';
import { GoCalendar } from 'react-icons/go';

import { CalendarRow } from '../../types/Newsletter';

interface CalendarTableProps {
  table: CalendarRow[];
}

const CalendarTable = ({ table }: CalendarTableProps) => {
  return (
    <Card shadow='sm' p={0} mb={8}>
      <Accordion
        defaultValue='calendar-0'
        styles={{
          label: { fontWeight: 700 },
        }}
      >
        <Accordion.Item m={0} value='calendar-0'>
          <Accordion.Control>
            <Group noWrap>
              <GoCalendar size={22} />
              <div>
                <Text>Calendar</Text>
                <Text size='sm' color='dimmed' weight={400}>
                  Upcoming Events
                </Text>
              </div>
            </Group>
          </Accordion.Control>

          <Accordion.Panel>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>State</th>
                  <th>Event</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row) => {
                  return (
                    <tr key={row.Event}>
                      <td>{row.State}</td>
                      <td>{row.Event}</td>
                      <td>{`${format(new Date(row.Date), 'EEEE do MMMM')}${
                        row.Time ? ` - ${row.Time}` : ''
                      }`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};

export default CalendarTable;
