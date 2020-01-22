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
import InputMaskUnform from '~/components/InputMaskUnform';

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
    // .min(40.0, 'O Peso deve ser no mínimo de 35Kg')
    .required('O Peso é obrigatório'),
  height: Yup.string()
    // .min(1.0, 'A Altura deve ser no mínimo de 1 metro')
    .required('A Altura é obrigatória'),
});

export default function EditForm({ handleSave, handleClose, oldStudent }) {
  const student = {
    ...oldStudent,
    birthday: new Date(oldStudent.birthday),
    height: Number(oldStudent.height / 100).toFixed(2),
    weight: `00${Number(oldStudent.weight / 100).toFixed(2)}`.substr(-6),
  };
  const [errorApi, setErrorApi] = useState(null);
  const [age, setAge] = useState(student.age);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (errorApi) {
      if (errorApi.response && errorApi.response.data) {
        if (
          errorApi.response.data.messages[0] &&
          errorApi.response.data.messages[0].errors[0]
        ) {
          toast.error(
            `Aluno não atualizado: ${errorApi.response.data.messages[0].errors[0]}`
          );
        }
      } else {
        toast.error(`Aluno não atualizado: ${errorApi}`);
      }
    }
  }, [errorApi]);

  async function handleInternalSave(data) {
    setSaving(true);
    try {
      data = {
        ...data,
        height: data.height * 100,
        weight: data.weight * 100,
        birthday: format(data.birthday, 'yyyy-MM-dd'),
      };

      const response = await api.put(`/students/${student.id}`, data);

      handleSave(response.data);
      setSaving(false);
    } catch (error) {
      console.tron.log(error);
      setErrorApi(error);
      setSaving(false);
    }
  }

  function handleDatePickerChange(date) {
    setAge(differenceInYears(new Date(), date));
  }

  return (
    <Container>
      <Content>
        <Form
          schema={schema}
          initialData={student}
          onSubmit={handleInternalSave}
          context={{ age }}
        >
          <header>
            <h1>Edição de aluno</h1>
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
                Atualizar
              </ButtonSave>
            </Buttons>
          </header>

          <hr />

          <div className="content">
            <label>Nome Completo</label>
            <Input
              type="text"
              name="name"
              placeholder="John Doe"
              disabled={saving ? 1 : 0}
            />

            <label>Endereço de e-mail</label>
            <Input
              type="email"
              name="email"
              placeholder="exemplo@email.com"
              disabled={saving ? 1 : 0}
            />

            <DivBoxRow>
              <DivBoxColumn>
                <label>
                  Idade {age ? <span className="age">{age} anos</span> : null}
                </label>
                <DatePicker
                  name="birthday"
                  onChange={handleDatePickerChange}
                  disabled={saving ? 1 : 0}
                />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>
                  Peso <span>(em kg)</span>
                </label>
                <InputMaskUnform
                  name="weight"
                  mask="999.9"
                  type="text"
                  disabled={saving ? 1 : 0}
                />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>Altura</label>
                <InputMaskUnform
                  name="height"
                  mask="9.99"
                  type="text"
                  disabled={saving ? 1 : 0}
                />
              </DivBoxColumn>
            </DivBoxRow>
          </div>
        </Form>
      </Content>
    </Container>
  );
}

EditForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  oldStudent: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    birthday: PropTypes.string,
    weight: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};
