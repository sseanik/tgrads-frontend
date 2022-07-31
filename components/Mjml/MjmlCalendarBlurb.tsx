import {
  MjmlColumn,
  MjmlSection,
  MjmlTable,
  MjmlText,
  MjmlWrapper,
} from 'mjml-react';

import { CalendarRow } from '../../types/Newsletter';
import { parseDateAndTime } from '../../utils/dateAndTimeUtil';

const MjmlCalendarBlurb = ({ table }: { table: CalendarRow[] }) => {
  // Use variables to track background for odd rows
  let initial = false;
  let current = '';
  return (
    <>
      <MjmlWrapper background-color='#fcfdff' css-class='border-shadow'>
        <MjmlSection padding='0px'>
          <MjmlColumn padding='0px'>
            <MjmlText
              align='center'
              color='#212b35'
              font-weight='bold'
              font-size='20px'
              padding='0px'
              paddingBottom='10px'
            >
              Upcoming Events
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection padding='0px'>
          <MjmlColumn padding='0px'>
            <MjmlTable padding='0 12px'>
              <tr
                style={{
                  borderBottom: '1px solid #000',
                  borderTop: '1px solid #000',
                  textAlign: 'center',
                }}
              >
                {Object.keys(table[0]).map((key) => {
                  if (key !== '__typename' && key !== 'Time')
                    return (
                      <th
                        style={{
                          background: '#e4ebff',
                          borderLeft: '1px solid #000',
                          borderRight: '1px solid #000',
                          textAlign:
                            key === 'Event' || key === 'Date'
                              ? 'left'
                              : undefined,
                          paddingLeft:
                            key === 'Event' || key === 'Date'
                              ? '10px'
                              : undefined,
                        }}
                        key={key}
                      >
                        {key}
                      </th>
                    );
                })}
              </tr>
              {table.map((row) => {
                if (!(current === row.State)) {
                  initial = !initial;
                  current = row.State;
                }
                return (
                  <tr
                    key={row.Event}
                    style={{
                      background: initial ? '#f3f3f3' : '#fff',
                    }}
                  >
                    <td
                      style={{
                        borderRight: '1px solid #000',
                        borderLeft: '1px solid #000',
                        textAlign: 'center',
                      }}
                    >
                      {row.State}
                    </td>
                    <td
                      style={{
                        borderRight: '1px solid #000',
                        textAlign: 'left',
                        paddingLeft: '10px',
                      }}
                    >
                      {row.Event}
                    </td>
                    <td
                      style={{
                        borderRight: '1px solid #000',
                        textAlign: 'left',
                        paddingLeft: '10px',
                      }}
                    >
                      {parseDateAndTime(row.Date, row.Time)}
                    </td>
                  </tr>
                );
              })}
              <tr
                style={{
                  borderBottom: '1px solid #000',
                }}
              />
            </MjmlTable>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
    </>
  );
};

export default MjmlCalendarBlurb;
