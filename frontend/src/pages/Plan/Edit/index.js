/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from '@rocketseat/unform';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import api from '~/services/api';

import InputMaskUnform from '~/components/InputMaskUnform';

import { Container, DivBoxRow, DivBoxColumn } from './styles';

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

export default function Edit({ history, location }) {
  const [plan, setPlan] = useState({
    ...location.state.plan,
    // duration: Number(location.state.plan.duration),
    price: `00${Number(location.state.plan.price / 100).toFixed(2)}`.substr(-6),
  });

  const [total, setTotal] = useState((plan.duration * plan.price).toFixed(2));

  function handleGoBack() {
    history.push('/plans', { currentPage: location.state.currentPage });
  }

  async function handleSubmit({ title, duration, price }) {
    price = (price * 100).toFixed(0);

    try {
      const response = await api.put(`/plans/${plan.id}`, {
        title,
        duration,
        price,
      });

      setPlan(response.data);
    } catch (error) {
      console.tron.error(error);
      toast.error('Erro ao editar o Plano');
    }

    console.tron.log('handleSubmit', {
      title,
      duration,
      price,
    });
  }

  function handleDurationChange(duration) {
    setPlan({ ...plan, duration });
    setTotal((duration * plan.price).toFixed(2));
  }

  function handlePriceChange(_price) {
    const price = Number(_price.replace('_', ''));
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(price)) {
      setPlan({ ...plan, price });
      setTotal((plan.duration * price).toFixed(2));
    }
  }

  return (
    <Container>
      <Form
        schema={schema}
        initialData={plan}
        onSubmit={handleSubmit}
        context={{ total }}
      >
        <header>
          <h1>Edição do plano</h1>
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
                min="1"
                step="1"
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
    </Container>
  );
}

Edit.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      plan: PropTypes.object.isRequired,
      currentPage: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
