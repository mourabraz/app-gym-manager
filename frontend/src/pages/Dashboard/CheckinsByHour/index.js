import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

import api from '~/services/api';

import LoadingIndicator from '~/components/LoadingIndicator';

import { Container, EmptyGraph } from './styles';

function CheckinsByHour() {
  const [dataChart, setDataChart] = useState({
    labels: [
      '07h',
      '08h',
      '09h',
      '10h',
      '11h',
      '12h',
      '13h',
      '14h',
      '15h',
      '16h',
      '17h',
      '18h',
      '19h',
      '20h',
      '21h',
      '22h',
      '23h',
    ],
    datasets: [
      {
        backgroundColor: 'rgba(238, 77, 100, 0.5)',
        borderColor: 'rgba(238, 77, 100, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(238, 77, 100, 0.8)',
        hoverBorderColor: 'rgba(238, 77, 100, 1)',
        data: [],
      },
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCheckins() {
      try {
        const { data } = await api.get(`/dashboard/checkins/hour`);
        const list = Array.from({ length: 17 }, () => 0).map((item, index) =>
          data.find(d => d.hour === index + 7)
            ? Number(data.find(d => d.hour === index + 7).count)
            : 0
        );

        setDataChart({
          ...dataChart,
          datasets: [
            {
              ...dataChart.datasets[0],
              data: list,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.tron.error(error);
      }
    }

    setLoading(true);
    loadCheckins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <header>
        <h2>
          Entradas na Academia por horas <span>últimos 84 dias</span>
        </h2>
        <h5>Academia abre às 08h00 e fecha às 22h00 7 dias por semana</h5>
      </header>

      {loading ? (
        <LoadingIndicator size={40} />
      ) : (
        <>
          {dataChart.datasets[0].data.length ? (
            <Bar
              color="#EE4D64"
              data={dataChart}
              width={100}
              height={50}
              options={{
                legend: {
                  display: false,
                },
                maintainAspectRatio: true,
              }}
            />
          ) : (
            <EmptyGraph>
              <p>Sem entradas nos últimos 84 dias</p>
            </EmptyGraph>
          )}
        </>
      )}
    </Container>
  );
}

export default CheckinsByHour;
