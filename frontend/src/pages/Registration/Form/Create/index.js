/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from '@rocketseat/unform';
import { differenceInYears, format, subYears } from 'date-fns';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '~/services/api';

import DatePicker from '~/components/DatePicker';

import {
  Container,
  Content,
  DivBoxRow,
  DivBoxColumn,
  Buttons,
  ButtonSave,
  ButtonClose,
} from './styles';

const schema = Yup.object().shape({
  student_id: Yup.number().required('O Aluno é obrigatório'),
  plan_id: Yup.number().required('O Plano é obrigatório'),
  start_date: Yup.date()
    .required('A data de nascimento é obrigatória')
    .min(new Date(), 'Somente para maiores de 10 anos'),
});

export default function CreateForm({ handleSave, handleClose }) {
  const registration = {
    student_id: 0,
    plan_id: 0,
    start_date: new Date(),
  };

  const [errorApi, setErrorApi] = useState(null);
  const [saving, setSaving] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [totalPrice, setTotalPrice] = useState(new Date());

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

  async function handleInternalSave(data) {
    setSaving(true);
    try {
      // data = {
      //   ...data,
      //   start_date: format(data.start_date, 'yyyy-MM-dd'),
      // };

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
    // setAge(differenceInYears(new Date(), date));
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
            <label>Aluno</label>
            <Input
              type="text"
              name="name"
              placeholder="John Doe"
              disabled={saving ? 1 : 0}
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
                <input type="text" value="" disabled />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>Valor Final</label>
                <input type="text" value="" disabled />
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
