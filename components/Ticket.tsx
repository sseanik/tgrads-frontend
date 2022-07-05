import { ForwardedRef, forwardRef } from 'react';
import QRCode from 'react-qr-code';

import styles from '../styles/Ticket.module.css';

interface TicketProps {
  firstName: string;
  lastName: string;
  code: string;
  altColours: boolean;
}

const Ticket = forwardRef(
  (props: TicketProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div className={styles.container} ref={ref}>
        <div className={styles.ticketContainer}>
          <div className={styles.leftSection}>
            <div
              className={`${
                props.altColours ? styles.altColour : styles.mainColour
              } ${styles.ticketImage}`}
            >
              <p className={styles.topDetails}>
                <span>Sunday</span>
                <span className={styles.dateText}>September 3rd</span>
                <span>2022</span>
              </p>
              <div className={styles.middleHeading}>
                <h1>Sydney Cruise Party</h1>
                <h2>NSW Telstra Graduate Association</h2>
              </div>
              <p className={styles.bottomDetails}>
                <span>King Street Wharf 3</span>
                <span>Darling Harbour</span>
              </p>
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.rightContainer}>
              <div className={styles.rightTicketSection}>
                <div className={styles.middleHeading}>
                  <h1 className={styles.name}>
                    {props.firstName} {props.lastName}
                  </h1>
                </div>
                <div className={styles.time}>
                  <p>
                    6:15 PM <span>to</span> 10:30 PM
                  </p>
                </div>
              </div>
              <div className={styles.rightTicketSection}>
                <div className={styles.barcode}>
                  <QRCode value={props.code} size={125} />
                </div>
                <p className={styles.ticketNumber}>{`#${props.code}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Ticket.displayName = 'MyComponent';

export default Ticket;
