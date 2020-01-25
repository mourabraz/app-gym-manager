/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { utcToZonedTime, format } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';

import PropTypes from 'prop-types';
import {
  MdAdd,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdArrowDownward,
  MdArrowUpward,
  MdCheckCircle,
} from 'react-icons/md';
import { toast } from 'react-toastify';

import api from '~/services/api';

import LoadingIndicator from '~/components/LoadingIndicator';

import Modal from '~/components/Modal';
import CreateForm from './Form/Create';
// import EditForm from './Form/Edit';

import {
  Content,
  Header,
  TableBox,
  ButtonPagination,
  EmptyTable,
  DivBoxRow,
  Loading,
  ButtonActive,
} from './styles';

export default function Registration({ location }) {
  const limit = 20;

  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [registrations, setRegistrations] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectRegistrationToEdit, setSelectedRegistrationToEdit] = useState(
    null
  );

  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);

  const [nameOrder, setNameOrder] = useState('asc');
  const [planOrder, setPlanOrder] = useState('');
  const [startOrder, setStartOrder] = useState('');
  const [endOrder, setEndOrder] = useState('');
  const [activeFilter, setActiveFilter] = useState(2);

  async function loadRegistrations({
    page = 1,
    query = '',
    name = 'asc',
    plan = '',
    start = '',
    end = '',
    active = 2,
  } = {}) {
    const response = await api.get(
      `/registrations?page=${page}&limit=${limit}&q=${query}&name=${name}&plan=${plan}&start=${start}&end=${end}&active=${active}`
    );

    const {
      registrations: _registrations,
      page: _page,
      total: _total,
      last_page: _lastPage,
    } = response.data;

    setIsFirstPage(Number(page) === 1);
    setIsLastPage(Number(page) === _lastPage);

    setRegistrations(
      _registrations.map(i => ({
        ...i,
        startDateFormated: format(
          utcToZonedTime(i.start_date, 'Europe/Lisbon'),
          "dd 'de' MMMM 'de' yyyy",
          { timeZone: 'Europe/Lisbon', locale: pt }
        ),
        endDateFormated: format(
          utcToZonedTime(i.end_date, 'Europe/Lisbon'),
          "dd 'de' MMMM 'de' yyyy",
          { timeZone: 'Europe/Lisbon', locale: pt }
        ),
      }))
    );
    setTotal(_total);
    setCurrentPage(_page);

    setLoading(false);
    setLoadingPage(false);
  }

  useEffect(() => {
    let _page = 1;
    if (location.state && location.state.currentPage) {
      _page = Number(location.state.currentPage);
      setCurrentPage(_page);
    }

    setLoading(true);
    loadRegistrations({ page: _page });
  }, []); // eslint-disable-line

  function handleBefore() {
    if (!isFirstPage) {
      const page = Number(currentPage) - 1;
      setCurrentPage(page);
      setLoadingPage(true);
      loadRegistrations({
        page,
        query: currentQuery,
        name: nameOrder,
        plan: planOrder,
        start: startOrder,
        end: endOrder,
        active: activeFilter,
      });
    }
  }

  function handleNext() {
    if (!isLastPage) {
      const page = Number(currentPage) + 1;
      setCurrentPage(page);
      setLoadingPage(true);
      loadRegistrations({
        page,
        query: currentQuery,
        name: nameOrder,
        plan: planOrder,
        start: startOrder,
        end: endOrder,
        active: activeFilter,
      });
    }
  }

  async function handleShowCreate() {
    setShowCreate(true);
  }

  function handleClose() {
    setShowCreate(false);
  }

  function handleCreateRegistration(registration) {
    console.tron.log('handleCreateRegistration', registration);

    setCurrentQuery('');
    setCurrentPage(1);
    setIsFirstPage(true);
    setIsLastPage(total + 1 <= limit);
    setTotal(total + 1);
    setNameOrder('asc');
    setPlanOrder('');
    setStartOrder('');
    setEndOrder('');

    registration = {
      ...registration,
      startDateFormated: format(
        utcToZonedTime(registration.start_date, 'Europe/Lisbon'),
        "dd 'de' MMMM 'de' yyyy",
        { timeZone: 'Europe/Lisbon', locale: pt }
      ),
      endDateFormated: format(
        utcToZonedTime(registration.end_date, 'Europe/Lisbon'),
        "dd 'de' MMMM 'de' yyyy",
        { timeZone: 'Europe/Lisbon', locale: pt }
      ),
    };

    const oldRegistrations = registrations;
    if (oldRegistrations.length >= limit) {
      oldRegistrations.pop();
    }

    oldRegistrations.push(registration);

    oldRegistrations.sort((a, b) =>
      // eslint-disable-next-line no-nested-ternary
      a.student.name > b.student.name
        ? 1
        : a.student.name < b.student.name
        ? -1
        : 0
    );

    // TODO: Melhorar a exibição do student adicionado
    setRegistrations([...oldRegistrations]);
    setShowCreate(false);
    toast.success(
      `Matrícula cadastrada com sucesso! Para o aluno de nome: ${registration.student.name}`
    );
  }

  async function handleDeleteRegistration(registration) {
    if (
      // eslint-disable-next-line no-alert
      window.confirm(
        'Tem certeza que deseja excluir a Matrícula?\nEsta ação é irreversível!'
      )
    ) {
      try {
        const response = await api.delete(`/registrations/${registration.id}`);
        if (response.data) {
          loadRegistrations({ query: currentQuery });

          toast.success(
            `A matrícula do aluno de nome ${registration.student.name} foi excluída com sucesso!`
          );
        }
      } catch (error) {
        console.tron.log(error);
        toast.error(
          `Matrícula não excluída: ${error.response.data.messages[0].errors[0]}`
        );
      }
    }
  }

  function handleSortOrder(field, order) {
    let tempNameOrder = nameOrder;
    let tempPlanOrder = planOrder;
    let tempStartOrder = startOrder;
    let tempEndOrder = endOrder;
    setLoadingPage(true);

    if (field === 'name') {
      if (order === tempNameOrder) {
        setNameOrder('');
        tempNameOrder = '';
      } else if (order === 'asc') {
        setNameOrder('asc');
        tempNameOrder = 'asc';
      } else {
        setNameOrder('desc');
        tempNameOrder = 'desc';
      }
    }
    if (field === 'plan') {
      if (order === tempPlanOrder) {
        setPlanOrder('');
        tempPlanOrder = '';
      } else if (order === 'asc') {
        setPlanOrder('asc');
        tempPlanOrder = 'asc';
      } else {
        setPlanOrder('desc');
        tempPlanOrder = 'desc';
      }
    }
    if (field === 'start') {
      if (order === tempStartOrder) {
        setStartOrder('');
        tempStartOrder = '';
      } else if (order === 'asc') {
        setStartOrder('asc');
        tempStartOrder = 'asc';
      } else {
        setStartOrder('desc');
        tempStartOrder = 'desc';
      }
    }

    if (field === 'end') {
      if (order === tempEndOrder) {
        setEndOrder('');
        tempEndOrder = '';
      } else if (order === 'asc') {
        setEndOrder('asc');
        tempEndOrder = 'asc';
      } else {
        setEndOrder('desc');
        tempEndOrder = 'desc';
      }
    }

    loadRegistrations({
      page: currentPage,
      query: currentQuery,
      name: tempNameOrder,
      plan: tempPlanOrder,
      start: tempStartOrder,
      end: tempEndOrder,
      active: activeFilter,
    });
  }

  function handleShowModalEdit(registration) {
    setSelectedRegistrationToEdit(registration);
  }

  function changeActiveFilter() {
    setLoadingPage(true);
    let active = activeFilter;

    if (activeFilter === 0) active = 1;
    else if (activeFilter === 1) active = 2;
    else active = 0;

    setActiveFilter(active);
    loadRegistrations({
      page: currentPage,
      query: currentQuery,
      name: nameOrder,
      plan: planOrder,
      start: startOrder,
      end: endOrder,
      active,
    });
  }

  return (
    <>
      {/* <Modal visible={selectRegistrationToEdit !== null}>
        {selectRegistrationToEdit ? (
          <EditForm
            oldRegistration={selectRegistrationToEdit}
            handleSave={_registration => {
              setRegistrations(
                registrations.map(s =>
                  s.id === _registration.id ? _registration : s
                )
              );
              setSelectedRegistrationToEdit(null);
            }}
            handleClose={() => setSelectedRegistrationToEdit(null)}
          />
        ) : null}
      </Modal> */}

      <Modal visible={showCreate}>
        <CreateForm
          handleClose={handleClose}
          handleSave={handleCreateRegistration}
        />
      </Modal>

      <Content>
        <Header>
          <h1>Gerenciando matrículas</h1>
          <DivBoxRow>
            <button type="button" onClick={handleShowCreate}>
              <MdAdd color="#fff" size={20} />
              Cadastrar
            </button>
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
                      disabled={isFirstPage || loadingPage ? 1 : 0}
                      type="button"
                      onClick={handleBefore}
                    >
                      {loadingPage ? (
                        <LoadingIndicator color="#fff" size={20} />
                      ) : (
                        <MdKeyboardArrowLeft color="#fff" size={20} />
                      )}
                      Anterior
                    </ButtonPagination>
                    <ButtonPagination
                      disabled={isLastPage || loadingPage ? 1 : 0}
                      type="button"
                      onClick={handleNext}
                    >
                      Próximo
                      {loadingPage ? (
                        <LoadingIndicator color="#fff" size={20} />
                      ) : (
                        <MdKeyboardArrowRight color="#fff" size={20} />
                      )}
                    </ButtonPagination>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th className="text-left">
                        <MdArrowUpward
                          color={nameOrder === 'desc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('name', 'desc')}
                        />
                        <MdArrowDownward
                          color={nameOrder === 'asc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('name', 'asc')}
                        />
                        Aluno
                      </th>
                      <th width="90" className="text-center">
                        <MdArrowUpward
                          color={planOrder === 'desc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('plan', 'desc')}
                        />
                        <MdArrowDownward
                          color={planOrder === 'asc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('plan', 'asc')}
                        />
                        Plano
                      </th>

                      <th width="180" className="text-center">
                        <MdArrowUpward
                          color={startOrder === 'desc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('start', 'desc')}
                        />
                        <MdArrowDownward
                          color={startOrder === 'asc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('start', 'asc')}
                        />
                        Início
                      </th>
                      <th width="180" className="text-center">
                        <MdArrowUpward
                          color={endOrder === 'desc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('end', 'desc')}
                        />
                        <MdArrowDownward
                          color={endOrder === 'asc' ? '#000' : '#ccc'}
                          size={20}
                          onClick={() => handleSortOrder('end', 'asc')}
                        />
                        Término
                      </th>
                      <th width="60" className="text-center">
                        <ButtonActive onClick={changeActiveFilter}>
                          {// eslint-disable-next-line no-nested-ternary
                          activeFilter === 0
                            ? 'Não Ativas'
                            : activeFilter === 1
                            ? 'Ativas'
                            : 'Ambas'}
                        </ButtonActive>
                      </th>
                      <th width="100" />
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(s => (
                      <tr key={s.id}>
                        <td>{s.student.name}</td>
                        <td>{s.plan.title}</td>
                        <td className="text-center">{s.startDateFormated}</td>
                        <td className="text-center">{s.endDateFormated}</td>
                        <td className="text-center">
                          {s.active ? (
                            <MdCheckCircle color="#42cb59" size={14} />
                          ) : (
                            <MdCheckCircle color="#ccc" size={14} />
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            disabled={loadingPage ? 1 : 0}
                            className="edit-button"
                            type="button"
                            onClick={() => {
                              handleShowModalEdit(s);
                            }}
                          >
                            editar
                          </button>
                          <button
                            disabled={loadingPage ? 1 : 0}
                            className="delete-button"
                            type="button"
                            onClick={() => {
                              handleDeleteRegistration(s);
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

Registration.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      currentPage: PropTypes.string,
    }),
  }),
};

Registration.defaultProps = {
  location: {},
};
