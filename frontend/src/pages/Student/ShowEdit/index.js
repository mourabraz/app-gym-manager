/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from '@rocketseat/unform';
import { parseISO, differenceInYears, format, subYears } from 'date-fns';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '~/services/api';

import DatePicker from '~/components/DatePicker';
import InputMaskUnform from '~/components/InputMaskUnform';
import CheckInTable from './Table/ChekInsTable';

import { Container, DivBoxRow, DivBoxColumn } from './styles';

const schema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'O Nome deve ter no mínimo três letras')
    .required('O Nome é obrigatório'),
  email: Yup.string()
    .email('Use um email válido')
    .required('O e-mail é obrigatório'),
  birthday: Yup.date()
    .required('A data de nascimento é obrigatória')
    .max(subYears(new Date(), 10), 'Somente para maiores de 10 anos'),
  weight: Yup.number()
    .min(40.0, 'O Peso deve ser no mínimo de 35Kg')
    .required('O Peso é obrigatório'),
  height: Yup.number()
    .min(1.0, 'A Altura deve ser no mínimo de 1 metro')
    .required('A Altura é obrigatória'),
});

export default function ShowEdit({ history, location }) {
  const student = {
    ...location.state.student,
    birthday: parseISO(location.state.student.birthday),
    height: Number(location.state.student.height / 100).toFixed(2),
    weight: `00${Number(location.state.student.weight / 100).toFixed(
      2
    )}`.substr(-6),
  };

  const [age, setAge] = useState(student.age);

  function handleDatePickerChange(date) {
    setAge(differenceInYears(new Date(), date));
  }

  function handleGoBack() {
    history.push('/students', { currentPage: location.state.currentPage });
  }

  function handleSubmit() {}

  return (
    <Container>
      <Form
        schema={schema}
        initialData={student}
        onSubmit={handleSubmit}
        context={{ age }}
      >
        <header>
          <h1>Visualização/Edição</h1>
          <div className="buttons">
            <button type="button" className="close" onClick={handleGoBack}>
              <MdKeyboardArrowLeft color="#fff" size={16} />
              Voltar
            </button>

            <button type="submit" className="save">
              <MdDone color="#fff" size={16} />
              Salvar
            </button>
          </div>
        </header>

        <hr />

        <div className="content">
          <label>Nome Completo</label>
          <Input type="text" name="name" placeholder="John Doe" />

          <label>Endereço de e-mail</label>
          <Input type="email" name="email" placeholder="exemplo@email.com" />

          <DivBoxRow>
            <DivBoxColumn>
              <label>
                Idade {age ? <span className="age">{age} anos</span> : null}
              </label>
              <DatePicker
                name="birthday"
                defaultValue={student.birthday}
                onChange={handleDatePickerChange}
              />
            </DivBoxColumn>

            <DivBoxColumn>
              <label>
                Peso <span>(em kg)</span>
              </label>
              <InputMaskUnform name="weight" mask="999.9" type="text" />
            </DivBoxColumn>

            <DivBoxColumn>
              <label>Altura</label>
              <InputMaskUnform name="height" mask="9.99" type="text" />
            </DivBoxColumn>
          </DivBoxRow>
        </div>
      </Form>

      <CheckInTable studentId={student.id} />
    </Container>
  );
}

ShowEdit.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      student: PropTypes.object.isRequired,
      currentPage: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
