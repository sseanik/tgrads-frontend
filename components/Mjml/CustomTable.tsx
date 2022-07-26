import { format } from 'date-fns';
import { MjmlSection, MjmlTable, MjmlText } from 'mjml-react';

const CustomTable = ({ table }) => {
  let initial = false;
  let current = '';
  return (
    <>
      <MjmlSection background-color='#fff' css-class='border-shadow'>
        <MjmlSection padding='0 0 20px 0'>
          <MjmlText
            align='center'
            color='#212b35'
            font-weight='bold'
            font-size='20px'
          >
            Upcoming Events
          </MjmlText>
        </MjmlSection>
        <MjmlSection padding='0 20px'>
          <MjmlTable>
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
                    {`${format(new Date(row.Date), 'EEEE do MMMM')}${
                      row.Time ? ` - ${row.Time}` : ''
                    }`}
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
        </MjmlSection>
      </MjmlSection>
    </>
  );
};

export default CustomTable;
