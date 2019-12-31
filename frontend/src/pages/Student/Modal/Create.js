/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from '@rocketseat/unform';
import { differenceInYears, format, subYears } from 'date-fns';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '~/services/api';

import DatePicker from '~/components/DatePicker';
import InputMaskUnform from '~/components/InputMaskUnform';

import { Container, ModalContent, DivBoxRow, DivBoxColumn } from './styles';

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
  weight: Yup.string()
    .min(40.0, 'O Peso deve ser no mínimo de 35Kg')
    .required('O Peso é obrigatório'),
  height: Yup.string()
    .min(1.0, 'A Altura deve ser no mínimo de 1 metro')
    .required('A Altura é obrigatória'),
});

export default function Create({ handleClose, handleSave }) {
  const [student, setStudent] = useState({
    name: '',
    email: '',
    birthday: new Date(),
    height: '',
    weight: '',
    age: null,
  });
  const [errorApi, setErrorApi] = useState(null);
  const [age, setAge] = useState(null);

  useEffect(() => {
    if (errorApi) {
      if (errorApi.response && errorApi.response.data) {
        if (
          errorApi.response.data.messages[0] &&
          errorApi.response.data.messages[0].errors[0]
        ) {
          toast.error(
            `Aluno não cadastrado: ${errorApi.response.data.messages[0].errors[0]}`
          );
        }
      } else {
        toast.error(`Aluno não cadastrado: ${errorApi}`);
      }
    }
  }, [errorApi]);

  async function handleInternalClose() {
    await setStudent({
      name: '',
      email: '',
      birthday: new Date(),
      height: 0,
      weight: 0,
      age: null,
    });

    handleClose();
  }

  async function handleInternalSave(data) {
    try {
      data = {
        ...data,
        height: data.height * 100,
        weight: data.weight * 100,
        birthday: format(data.birthday, 'yyyy-MM-dd'),
      };

      const response = await api.post('/students', data);

      handleSave(response.data);

      handleInternalClose();
    } catch (error) {
      console.tron.log(error);
      setErrorApi(error);
    }
  }

  function handleDatePickerChange(date) {
    setAge(differenceInYears(new Date(), date));
  }

  return (
    <Container>
      <ModalContent>
        <Form
          schema={schema}
          initialData={student}
          onSubmit={handleInternalSave}
          context={{ age }}
        >
          <header>
            <h1>Cadastro de aluno</h1>
            <div className="buttons">
              <button
                type="button"
                className="close"
                onClick={handleInternalClose}
              >
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
                <DatePicker name="birthday" onChange={handleDatePickerChange} />
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
      </ModalContent>
    </Container>
  );
}

Create.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};
