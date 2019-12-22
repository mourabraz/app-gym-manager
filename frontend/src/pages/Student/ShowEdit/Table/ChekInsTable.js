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

import { Container, BoxGrid, Day, CheckinInfo } from './styles';

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
        checkins: checkins.filter(c =>
          isEqual(
            startOfDay(utcToZonedTime(parseISO(c.createdAt), timezone)),
            startOfDay(subDays(new Date(), 84 - index - 1))
          )
        ),
      };
    });

    setDaysArray(daysTemp);
    console.tron.log(daysTemp);
  }, [checkins]);

  useEffect(() => {
    async function loadCheckins() {
      try {
        const { data } = await api.get(`/students/${studentId}/checkins`);
        setCheckins(data.checkins);
        console.tron.log(data);
      } catch (error) {
        console.tron.error(error);
      }
    }

    loadCheckins();
  }, [studentId]);

  return (
    <Container>
      <h2>Entradas: {checkins.length}</h2>

      <BoxGrid>
        <div className="month month1">{month1}</div>
        <div className="month month2">{month2}</div>
        <div className="month month3">{month3}</div>

        {/* <div className="cell day hasCheckin" />
        <div className="cell day" /> */}

        {daysArray.map(item => (
          <Day key={item.date.getTime()}>
            {item.date.getDate()}
            <CheckinInfo hasCheckins={item.checkins}>
              {item.checkins.length > 1 ? (
                <span>({item.checkins.length})</span>
              ) : null}
            </CheckinInfo>
          </Day>
        ))}
      </BoxGrid>
    </Container>
  );
}

CheckInsTable.propTypes = {
  studentId: PropTypes.number.isRequired,
};
