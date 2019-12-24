import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  subMonths,
  subDays,
  startOfDay,
  isEqual,
  parseISO,
  format,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import { Container, BoxGrid, Day, CheckinInfo, DayPopover } from './styles';

export default function CheckInsTable({ studentId }) {
  const month1 = format(subMonths(new Date(), 2), 'MMMM', {
    locale: pt,
  });
  const month2 = format(subMonths(new Date(), 1), 'MMMM', {
    locale: pt,
  });
  const month3 = format(new Date(), 'MMMM', {
    locale: pt,
  });
  const [checkins, setCheckins] = useState([]);
  const [daysArray, setDaysArray] = useState([]);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const daysTemp = Array.from(new Array(84)).map((item, index) => {
      return {
        date: startOfDay(subDays(new Date(), 84 - index - 1)),
        checkins: checkins
          .filter(c =>
            isEqual(
              startOfDay(utcToZonedTime(parseISO(c.createdAt), timezone)),
              startOfDay(subDays(new Date(), 84 - index - 1))
            )
          )
          .map(c => ({
            formatted: format(
              utcToZonedTime(parseISO(c.createdAt), timezone),
              'HH:mm'
            ),
          })),
      };
    });

    setDaysArray(daysTemp);
  }, [checkins]);

  useEffect(() => {
    async function loadCheckins() {
      try {
        const { data } = await api.get(`/students/${studentId}/checkins`);
        setCheckins(
          data.checkins.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
        );
      } catch (error) {
        console.tron.error(error);
      }
    }

    loadCheckins();
  }, [studentId]);

  return (
    <Container>
      <h2>
        Entradas:{' '}
        {checkins.length ? (
          checkins.length
        ) : (
          <span>sem entradas na academia</span>
        )}
      </h2>

      {checkins.length ? (
        <BoxGrid>
          <div className="month month1">{month1}</div>
          <div className="month month2">{month2}</div>
          <div className="month month3">{month3}</div>

          {daysArray.map(item => (
            <Day key={item.date.getTime()} times={item.checkins}>
              {item.checkins.length ? (
                <DayPopover>
                  {item.checkins.map((time, index) => (
                    <span key={time.formatted}>
                      {index + 1}º às {time.formatted}
                    </span>
                  ))}
                </DayPopover>
              ) : null}

              {item.date.getDate()}
              <CheckinInfo checkins={item.checkins}>
                {item.checkins.length > 1 ? (
                  <span>({item.checkins.length})</span>
                ) : null}
              </CheckinInfo>
            </Day>
          ))}
        </BoxGrid>
      ) : null}
    </Container>
  );
}

CheckInsTable.propTypes = {
  studentId: PropTypes.number.isRequired,
};
