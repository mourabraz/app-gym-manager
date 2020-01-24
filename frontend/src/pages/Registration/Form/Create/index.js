/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@rocketseat/unform';
import { addMonths, startOfDay, format } from 'date-fns';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '~/services/api';

import DatePicker from '~/components/DatePicker';
import AssyncSelect from '~/components/AssyncSelect';
import ReactSelect from '~/components/ReactSelect';

import {
  Container,
  Content,
  DivBoxRow,
  DivBoxColumn,
  Buttons,
  ButtonSave,
  ButtonClose,
} from './styles';

export default function CreateForm({ handleSave, handleClose }) {
  const schema = Yup.object().shape({
    student_id: Yup.string().required('O Aluno é obrigatório'),
    plan_id: Yup.string().required('O Plano é obrigatório'),
    start_date: Yup.date()
      .required()
      .min(startOfDay(new Date()), 'Somente a partir do dia de hoje'),
  });

  const registration = {
    student_id: 0,
    plan_id: 0,
    start_date: new Date(),
  };

  const [errorApi, setErrorApi] = useState(null);
  const [saving, setSaving] = useState(false);
  const [endDate, setEndDate] = useState(format(new Date(), 'dd/MM/yyyy'));
  const [totalPrice, setTotalPrice] = useState(0);
  const [plans, setPlans] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [plan, setPlan] = useState();

  useEffect(() => {
    async function loadPlans() {
      const response = await api.get(`/plans?limit=500`);
      const currencyFormat = new Intl.NumberFormat('pt', {
        style: 'currency',
        currency: 'EUR',
      });

      const { plans: _plans } = response.data;

      setPlans(
        _plans
          ? _plans.map(p => ({
              ...p,
              originalTitle: p.title,
              title: `${p.title} (${currencyFormat.format(p.price / 100)})`,
            }))
          : []
      );
    }

    loadPlans();
  }, []);

  useEffect(() => {
    if (errorApi) {
      if (errorApi.response && errorApi.response.data) {
        if (
          errorApi.response.data.messages[0] &&
          errorApi.response.data.messages[0].errors[0]
        ) {
          toast.error(
            `Matrícula não registrada: ${errorApi.response.data.messages[0].errors[0]}`
          );
        }
      } else {
        toast.error(`Matrícula não registrada: ${errorApi}`);
      }
    }
  }, [errorApi]);

  useEffect(() => {
    if (!plan || !startDate) return;
    const _price = new Intl.NumberFormat('pt', {
      style: 'currency',
      currency: 'EUR',
    }).format((plan.price * plan.duration) / 100);
    setTotalPrice(_price);
    setEndDate(format(addMonths(startDate, plan.duration), 'dd/MM/yyyy'));
  }, [plan, startDate]);

  async function handleInternalSave(data) {
    console.tron.log('handleInternalSave', data);
    setSaving(true);
    try {
      const response = await api.post(`/registrations`, data);
      handleSave(response.data);
      setSaving(false);
    } catch (error) {
      console.tron.log(error);
      setErrorApi(error);
      setSaving(false);
    }
  }

  function handleDatePickerChange(date) {
    setStartDate(startOfDay(date));
  }

  function handleSelectChange(_plan) {
    setPlan(_plan);
  }

  function getPromisse(inputValue) {
    return new Promise((resolve, reject) => {
      api
        .get(`/students?page=1&limit=100&q=${inputValue}&active=0`)
        .then(result => {
          const { students } = result.data;
          if (students.length > 0) {
            resolve(students.map(s => ({ value: s.id, label: s.name })));
          } else {
            resolve([
              {
                value: 0,
                label: 'Digite as primeiras letras do nome do aluno',
              },
            ]);
          }
        })
        .catch(error => reject(error));
    });
  }

  return (
    <Container>
      <Content>
        <Form
          schema={schema}
          initialData={registration}
          onSubmit={handleInternalSave}
          context={{ endDate, totalPrice }}
        >
          <header>
            <h1>Cadastro de matrícula</h1>
            <Buttons>
              <ButtonClose
                type="button"
                className="close"
                onClick={() => handleClose()}
                disabled={saving}
              >
                <MdKeyboardArrowLeft color="#fff" size={16} />
                Voltar
              </ButtonClose>
              <ButtonSave
                type="submit"
                className="save"
                disabled={saving}
                saving={saving ? 1 : 0}
              >
                {saving ? (
                  <FaSpinner color="#FFF" size={16} />
                ) : (
                  <MdDone color="#fff" size={16} />
                )}
                Salvar
              </ButtonSave>
            </Buttons>
          </header>

          <hr />

          <div className="content">
            <AssyncSelect
              name="student_id"
              label="Aluno (sem matrícula ativa)"
              promiseOptions={getPromisse}
              disabled={saving}
            />

            <ReactSelect
              name="plan_id"
              label="Plano"
              options={plans}
              onChange={handleSelectChange}
              disabled={saving}
            />

            <DivBoxRow>
              <DivBoxColumn>
                <label>Data de Início</label>
                <DatePicker
                  name="start_date"
                  onChange={handleDatePickerChange}
                  disabled={saving ? 1 : 0}
                />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>Data de Término</label>
                <input type="text" value={endDate} disabled />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>Valor Final</label>
                <input
                  type="text"
                  className="text-right"
                  value={totalPrice}
                  disabled
                />
              </DivBoxColumn>
            </DivBoxRow>
          </div>
        </Form>
      </Content>
    </Container>
  );
}

CreateForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};
