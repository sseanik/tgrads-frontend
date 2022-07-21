import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  startOfWeek,
  subWeeks,
} from 'date-fns';
import { useState } from 'react';

import styles from '../styles/Scheduler.module.css';

const Scheduler = () => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(today);
  const [monday, setMonday] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const [friday, setFriday] = useState(
    addDays(startOfWeek(today, { weekStartsOn: 1 }), 4)
  );

  const changeWeekHandle = (forward: boolean) => {
    const newWeek = forward
      ? addWeeks(currentWeek, 1)
      : subWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    setMonday(startOfWeek(newWeek, { weekStartsOn: 1 }));
    setFriday(addDays(startOfWeek(newWeek, { weekStartsOn: 1 }), 4));
    console.log(startOfWeek(newWeek, { weekStartsOn: 1 }));
  };

  const renderHeader = () => {
    const monthCheck = monday.getMonth() === friday.getMonth();

    return (
      <div className={`${styles.header} ${styles.row} ${styles.flexMiddle}`}>
        <div className={`${styles.col} ${styles.colStart}`}>
          <div className={styles.icon} onClick={() => changeWeekHandle(false)}>
            Previous Week
          </div>
        </div>
        <span>
          {monthCheck
            ? format(monday, 'MMMM')
            : `${format(monday, 'MMMM')} - ${format(friday, 'MMMM')}`}
        </span>
        <div
          className={`${styles.col} ${styles.colEnd}`}
          onClick={() => changeWeekHandle(true)}
        >
          <div className={styles.icon}>Next Week</div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return (
      <div className={`${styles.days} ${styles.row}`}>
        {days.map((day) => {
          return (
            <div className={`${styles.col} ${styles.colCenter}`} key={day}>
              {day}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCells = () => {
    const cells: any = [];
    let loopDate = monday;
    let formattedDate = '';
    while (loopDate <= friday) {
      formattedDate = format(loopDate, 'd');

      cells.push(
        <div
          className={`${styles.col} ${styles.cell} ${
            isSameDay(loopDate, new Date()) ? styles.today : styles.notToday
          }`}
          key={loopDate.toISOString()}
        >
          <span className={styles.number}>{formattedDate}</span>
        </div>
      );
      loopDate = addDays(loopDate, 1);
    }

    return (
      <div className={`${styles.days} ${styles.row}`}>
        <div className={`${styles.col} ${styles.colCenter}`}>{cells}</div>
      </div>
    );
  };

  return (
    <div className={styles.calendar}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Scheduler;
