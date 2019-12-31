import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {
  subMonths,
  subDays,
  startOfDay,
  isEqual,
  parseISO,
  format,
} from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import LoadingIndicator from '~/components/LoadingIndicator';

import { Container, BoxGrid, Day, CheckinInfo, EmptyList } from './styles';

export default function ChekinsByDay() {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const daysTemp = Array.from(new Array(84)).map((item, index) => {
      return {
        id: index,
        date: startOfDay(subDays(new Date(), 84 - index - 1)),
        checkins: checkins.filter(c =>
          isEqual(
            startOfDay(parseISO(c.date)),
            startOfDay(subDays(new Date(), 84 - index - 1))
          )
        ),
      };
    });

    setDaysArray(daysTemp);
  }, [checkins]);

  useEffect(() => {
    async function loadCheckins() {
      try {
        const { data } = await api.get(`/dashboard/checkins/day`);
        setCheckins(data.sort((a, b) => (a.date > b.date ? 1 : -1)));
        setLoading(false);
      } catch (error) {
        console.tron.error(error);
      }
    }

    setLoading(true);
    loadCheckins();
  }, []);

  return (
    <Container>
      <header>
        <h2>
          Quadro Geral de Entradas <span>últimos 84 dias</span>
        </h2>
      </header>

      <TransitionGroup component={null}>
        {loading ? (
          <LoadingIndicator size={40} />
        ) : (
          checkins.length && (
            <CSSTransition classNames="fadein" timeout={500}>
              {checkins.length ? (
                <BoxGrid>
                  <div className="month month1">{month1}</div>
                  <div className="month month2">{month2}</div>
                  <div className="month month3">{month3}</div>

                  {daysArray.map(item => (
                    <Day key={String(item.id)}>
                      {item.date.getDate()}
                      <CheckinInfo>
                        {item.checkins.length ? (
                          <span>{item.checkins[0].count}</span>
                        ) : null}
                      </CheckinInfo>
                    </Day>
                  ))}
                </BoxGrid>
              ) : (
                <EmptyList>
                  <p>Sem entradas nos últimos 84 dias</p>
                </EmptyList>
              )}
            </CSSTransition>
          )
        )}
      </TransitionGroup>
    </Container>
  );
}
