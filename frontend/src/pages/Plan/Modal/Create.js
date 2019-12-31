/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from '@rocketseat/unform';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '~/services/api';

import InputMaskUnform from '~/components/InputMaskUnform';

import { Container, ModalContent, DivBoxRow, DivBoxColumn } from './styles';

const schema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'O Título deve ter no mínimo três letras')
    .required('O Título é obrigatório'),
  duration: Yup.number()
    .min(1, 'Duração mínima de 1 mês')
    .required('A Duração é obrigatória'),
  price: Yup.string()
    .min(0.1, 'O preço deve ser maior que zero')
    .required('O preço é obrigatório'),
});

export default function Create({ handleClose, handleSave }) {
  const [plan, setPlan] = useState({
    title: '',
    duration: 0,
    price: 0,
  });
  const [errorApi, setErrorApi] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (errorApi) {
      if (errorApi.response && errorApi.response.data) {
        if (
          errorApi.response.data.messages[0] &&
          errorApi.response.data.messages[0].errors[0]
        ) {
          toast.error(
            `Plano não cadastrado: ${errorApi.response.data.messages[0].errors[0]}`
          );
        }
      } else {
        toast.error(`Plano não cadastrado: ${errorApi}`);
      }
    }
  }, [errorApi]);

  async function handleInternalClose() {
    await setPlan({
      title: '',
      duration: 0,
      price: 0,
    });

    handleClose();
  }

  async function handleInternalSave(data) {
    try {
      data = {
        ...data,
        price: data.price * 100,
      };

      const response = await api.post('/plans', data);

      handleSave(response.data);

      handleInternalClose();
    } catch (error) {
      console.tron.log(error);
      setErrorApi(error);
    }
  }

  function handleDurationChange(duration) {
    setPlan({ ...plan, duration });
    setTotal(plan.duration * plan.price);
  }

  function handlePriceChange(price) {
    setPlan({ ...plan, price });
    setTotal(plan.duration * plan.price);
  }

  return (
    <Container>
      <ModalContent>
        <Form
          schema={schema}
          initialData={plan}
          onSubmit={handleInternalSave}
          context={{ total }}
        >
          <header>
            <h1>Cadastro de plano</h1>
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
            <label>Título do Plano</label>
            <Input type="text" name="title" />
            <DivBoxRow>
              <DivBoxColumn>
                <label>
                  Duração <span>(em meses)</span>
                </label>
                <Input
                  type="number"
                  name="duration"
                  onChange={e => handleDurationChange(e.target.value)}
                />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>Preço Mensal</label>
                <InputMaskUnform
                  name="price"
                  mask="999.99"
                  type="text"
                  onChange={e => handlePriceChange(e.target.value)}
                />
              </DivBoxColumn>

              <DivBoxColumn>
                <label>Preço Total</label>
                <input type="text" value={total} disabled />
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
