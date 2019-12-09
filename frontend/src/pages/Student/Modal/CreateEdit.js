/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from '@rocketseat/unform';
import { differenceInYears } from 'date-fns';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import * as Yup from 'yup';

import DatePicker from '~/components/DatePicker';

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
    .max(new Date(), 'Somente para datas passadas'),
  weight: Yup.number().required('O Peso é obrigatório'),
  height: Yup.number().required('A Altura é obrigatória'),
});

export default function CreateEdit({
  show,
  handleClose,
  handleSave,
  oldStudent,
}) {
  const [student, setStudent] = useState(
    oldStudent
      ? {
          name: oldStudent.name,
          email: oldStudent.email,
          birthday: oldStudent.birthday,
          height: oldStudent.heigth,
          weight: oldStudent.weight,
          age: oldStudent.age,
        }
      : {
          name: '',
          email: '',
          birthday: new Date(),
          height: 0,
          weight: 0,
          age: null,
        }
  );

  const [age, setAge] = useState(oldStudent ? oldStudent.age : null);

  function handleInternalClose() {
    console.tron.log('handleInternalClose');
    setStudent({
      name: '',
      email: '',
      birthday: new Date(),
      height: 0,
      weight: 0,
      age: null,
    });

    handleClose();
  }

  function handleInternalSave(data) {
    console.tron.log('handleInternalSave');
    console.tron.log(data);

    // handleSave();
  }

  function handleDatePickerChange(date) {
    setAge(differenceInYears(new Date(), date));
  }

  return (
    <Container className="modal" show={show ? 1 : 0}>
      <ModalContent className="modal">
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
                <Input type="number" min="0" step="0.01" name="weight" />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>Altura</label>
                <Input type="number" min="0" step="0.01" name="height" />
              </DivBoxColumn>
            </DivBoxRow>
          </div>
        </Form>
      </ModalContent>
    </Container>
  );
}

CreateEdit.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  oldStudent: PropTypes.oneOfType([PropTypes.object]),
};

CreateEdit.defaultProps = {
  show: false,
  oldStudent: null,
};
