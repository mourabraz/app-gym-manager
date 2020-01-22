/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import {
  MdAdd,
  MdSearch,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdArrowDownward,
  MdArrowUpward,
} from 'react-icons/md';
import { toast } from 'react-toastify';

import api from '~/services/api';

import LoadingIndicator from '~/components/LoadingIndicator';
import Create from './Modal/Create';

import {
  Content,
  Header,
  TableBox,
  ButtonPagination,
  EmptyTable,
  DivBoxRow,
  Loading,
} from './styles';

export default function Plan({ history, location }) {
  const limit = 20;
  const timer = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [plans, setPlans] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const [titleOrder, setTitleOrder] = useState('asc');
  const [durationOrder, setDurationOrder] = useState('');
  const [priceOrder, setPriceOrder] = useState('');

  async function loadPlans({
    page = 1,
    query = '',
    title = 'asc',
    duration = '',
    price = '',
  } = {}) {
    const response = await api.get(
      `/plans?page=${page}&limit=${limit}&q=${query}&title=${title}&duration=${duration}&price=${price}`
    );
    const currencyFormat = new Intl.NumberFormat('pt', {
      style: 'currency',
      currency: 'EUR',
    });

    const {
      plans: _plans,
      page: _page,
      total: _total,
      last_page: _lastPage,
    } = response.data;

    setIsFirstPage(Number(page) === 1);
    setIsLastPage(Number(page) === _lastPage);

    setPlans(
      _plans.map(p => ({
        ...p,
        formatedPrice: currencyFormat.format(p.price / 100),
      }))
    );
    setTotal(_total);
    setCurrentPage(_page);
    setLoading(false);
  }

  useEffect(() => {
    let _page = 1;
    if (location.state && location.state.currentPage) {
      _page = Number(location.state.currentPage);
      setCurrentPage(_page);
    }
    setLoading(true);
    loadPlans({ page: _page });
  }, []); // eslint-disable-line

  function handleQueryChange(event) {
    if (timer.current) clearTimeout(timer.current);

    const _query = event.target.value;
    setCurrentQuery(_query);

    timer.current = setTimeout(() => {
      loadPlans({ query: _query });
    }, 600);
  }

  function handleBefore() {
    if (!isFirstPage) {
      const page = Number(currentPage) - 1;
      setCurrentPage(page);
      loadPlans({
        page,
        query: currentQuery,
        title: titleOrder,
        duration: durationOrder,
        price: priceOrder,
      });
    }
  }

  function handleNext() {
    if (!isLastPage) {
      const page = Number(currentPage) + 1;
      setCurrentPage(page);
      loadPlans({
        page,
        query: currentQuery,
        title: titleOrder,
        duration: durationOrder,
        price: priceOrder,
      });
    }
  }

  async function handleShowCreate() {
    setShowCreate(true);
  }

  function handleClose() {
    setShowCreate(false);
  }

  function handleCreatePlan(plan) {
    setCurrentQuery('');
    setCurrentPage(1);
    setIsFirstPage(true);
    setIsLastPage(total + 1 <= limit);
    setTotal(total + 1);
    setTitleOrder('');
    setDurationOrder('');
    setPriceOrder('');

    const oldPlans = plans;
    if (oldPlans.length >= limit) {
      oldPlans.pop();
    }

    // TODO: Melhorar a exibição do plan adicionado
    setPlans([...oldPlans, plan]);

    toast.success(`Plano cadastrado com sucesso! Título: ${plan.title}`);
  }

  async function handleDeletePlan(plan) {
    if (
      // eslint-disable-next-line no-alert
      window.confirm(
        'Tem certeza que deseja excluir o plano?\nEsta ação é irreversível!'
      )
    ) {
      try {
        const response = await api.delete(`/plans/${plan.id}`);
        if (response.data) {
          loadPlans({ query: currentQuery });

          toast.success(
            `Plano de título ${plan.title} foi excluído com sucesso!`
          );
        }
      } catch (error) {
        console.tron.log(error);
        toast.error(
          `Plano não excluído: ${error.response.data.messages[0].errors[0]}`
        );
      }
    }
  }

  function handleShowEdit(plan) {
    console.tron.log('handleShowEdit', plan);
    history.push('/plans/edit', {
      plan,
      currentPage,
    });
  }

  function handleSortOrder(field, order) {
    let tempTitleOrder = titleOrder;
    let tempDurationOrder = durationOrder;
    let tempPriceOrder = priceOrder;

    if (field === 'title') {
      if (order === tempTitleOrder) {
        setTitleOrder('');
        tempTitleOrder = '';
      } else if (order === 'asc') {
        setTitleOrder('asc');
        tempTitleOrder = 'asc';
      } else {
        setTitleOrder('desc');
        tempTitleOrder = 'desc';
      }
    }
    if (field === 'duration') {
      if (order === tempDurationOrder) {
        setDurationOrder('');
        tempDurationOrder = '';
      } else if (order === 'asc') {
        setDurationOrder('asc');
        tempDurationOrder = 'asc';
      } else {
        setDurationOrder('desc');
        tempDurationOrder = 'desc';
      }
    }
    if (field === 'price') {
      if (order === tempPriceOrder) {
        setPriceOrder('');
        tempPriceOrder = '';
      } else if (order === 'asc') {
        setPriceOrder('asc');
        tempPriceOrder = 'asc';
      } else {
        setPriceOrder('desc');
        tempPriceOrder = 'desc';
      }
    }

    loadPlans({
      page: currentPage,
      query: currentQuery,
      title: tempTitleOrder,
      duration: tempDurationOrder,
      price: tempPriceOrder,
    });
  }

  return (
    <>
      <TransitionGroup component={null}>
        {showCreate && (
          <CSSTransition classNames="dialog" timeout={300}>
            <Create handleClose={handleClose} handleSave={handleCreatePlan} />
          </CSSTransition>
        )}
      </TransitionGroup>

      <Content>
        <Header>
          <h1>Gerenciando planos</h1>
          <DivBoxRow>
            <button type="button" onClick={handleShowCreate}>
              <MdAdd color="#fff" size={20} />
              Cadastrar
            </button>

            <label className="search" htmlFor="search">
              <MdSearch color="#444" size={16} />
              <input
                type="text"
                placeholder="Buscar plano"
                onChange={handleQueryChange}
                disabled={loading ? 1 : 0}
              />
            </label>
          </DivBoxRow>
        </Header>

        {loading ? (
          <Loading>
            <LoadingIndicator size={40} />
          </Loading>
        ) : (
          <>
            {total ? (
              <TableBox>
                <div>
                  <p>
                    <span>Total de registros: {total}</span>
                    <span>Exibindo: {limit}</span>
                    <span>Página: {currentPage}</span>
                  </p>
                  <div className="pagination">
                    <ButtonPagination
                      disabled={isFirstPage ? 1 : 0}
                      type="button"
                      onClick={handleBefore}
                    >
                      <MdKeyboardArrowLeft color="#fff" size={20} />
                      Anterior
                    </ButtonPagination>
                    <ButtonPagination
                      disabled={isLastPage ? 1 : 0}
                      type="button"
                      onClick={handleNext}
                    >
                      Próximo
                      <MdKeyboardArrowRight color="#fff" size={20} />
                    </ButtonPagination>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th className="text-left">
                        <MdArrowUpward
                          color={titleOrder === 'desc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('title', 'desc')}
                        />
                        <MdArrowDownward
                          color={titleOrder === 'asc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('title', 'asc')}
                        />
                        Título
                      </th>
                      <th width="150" className="text-center">
                        <MdArrowUpward
                          color={durationOrder === 'desc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('duration', 'desc')}
                        />
                        <MdArrowDownward
                          color={durationOrder === 'asc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('duration', 'asc')}
                        />
                        Duração
                      </th>
                      <th width="200" className="text-center">
                        <MdArrowUpward
                          color={priceOrder === 'desc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('price', 'desc')}
                        />
                        <MdArrowDownward
                          color={priceOrder === 'asc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('price', 'asc')}
                        />
                        Valor p/ Mês
                      </th>
                      <th width="100" />
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map(s => (
                      <tr key={s.id}>
                        <td>{s.title}</td>
                        <td className="text-center">{s.duration}</td>
                        <td className="text-right">{s.formatedPrice}</td>
                        <td className="text-center">
                          <button
                            className="edit-button"
                            type="button"
                            onClick={() => {
                              handleShowEdit(s);
                            }}
                          >
                            editar
                          </button>
                          <button
                            className="delete-button"
                            type="button"
                            onClick={() => {
                              handleDeletePlan(s);
                            }}
                          >
                            apagar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableBox>
            ) : (
              <EmptyTable>
                <p>Lista Vazia</p>
              </EmptyTable>
            )}
          </>
        )}
      </Content>
    </>
  );
}

Plan.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      currentPage: PropTypes.string,
    }),
  }),
};

Plan.defaultProps = {
  location: {},
};
