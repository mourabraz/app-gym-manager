/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
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

import Create from './Modal/Create';

import {
  Content,
  Header,
  TableBox,
  ButtonPagination,
  EmptyTable,
  DivBoxRow,
} from './styles';

export default function Student({ history, location }) {
  const limit = 20;
  const timer = useRef(null);

  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [students, setStudents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const [nameOrder, setNameOrder] = useState('asc');
  const [emailOrder, setEmailOrder] = useState('');
  const [birthdayOrder, setBirthdayOrder] = useState('');

  async function loadStudents({
    page = 1,
    query = '',
    name = 'asc',
    email = '',
    birthday = '',
  } = {}) {
    const response = await api.get(
      `/students?page=${page}&limit=${limit}&q=${query}&name=${name}&email=${email}&birthday=${birthday}`
    );

    const {
      students: _students,
      page: _page,
      total: _total,
      last_page: _lastPage,
    } = response.data;

    // console.tron.log(
    //   `loadSturents called`,
    //   _students,
    //   _page,
    //   _total,
    //   _lastPage
    // );
    setIsFirstPage(Number(page) === 1);
    setIsLastPage(Number(page) === _lastPage);

    setStudents(_students);
    setTotal(_total);
    setCurrentPage(_page);
  }

  useEffect(() => {
    let _page = 1;
    if (location.state && location.state.currentPage) {
      _page = Number(location.state.currentPage);
      setCurrentPage(_page);
    }
    loadStudents({ page: _page });
  }, []); // eslint-disable-line

  function handleQueryChange(event) {
    if (timer.current) clearTimeout(timer.current);

    const _query = event.target.value;
    setCurrentQuery(_query);

    timer.current = setTimeout(() => {
      loadStudents({ query: _query });
    }, 600);
  }

  function handleBefore() {
    if (!isFirstPage) {
      const page = Number(currentPage) - 1;
      setCurrentPage(page);
      loadStudents({
        page,
        query: currentQuery,
        name: nameOrder,
        email: emailOrder,
        birthday: birthdayOrder,
      });
    }
  }

  function handleNext() {
    if (!isLastPage) {
      const page = Number(currentPage) + 1;
      setCurrentPage(page);
      loadStudents({
        page,
        query: currentQuery,
        name: nameOrder,
        email: emailOrder,
        birthday: birthdayOrder,
      });
    }
  }

  async function handleShowCreate() {
    setShowCreate(true);
  }

  function handleClose() {
    setShowCreate(false);
  }

  function handleCreateStudent(student) {
    setCurrentQuery('');
    setCurrentPage(1);
    setIsFirstPage(true);
    setIsLastPage(total + 1 <= limit);
    setTotal(total + 1);
    setNameOrder('');
    setEmailOrder('');
    setBirthdayOrder('');

    const oldStudents = students;
    if (oldStudents.length >= limit) {
      oldStudents.pop();
    }

    // TODO: Melhorar a exibição do student adicionado
    setStudents([...oldStudents, student]);

    toast.success(`Aluno cadastrado com sucesso! Nome: ${student.name}`);
  }

  async function handleDeleteStudent(student) {
    if (
      // eslint-disable-next-line no-alert
      window.confirm(
        'Tem certeza que deseja excluir o estudante?\nEsta ação é irreversível!'
      )
    ) {
      try {
        const response = await api.delete(`/students/${student.id}`);
        if (response.data) {
          loadStudents({ query: currentQuery });

          toast.success(
            `Aluno de nome ${student.name} foi excluído com sucesso!`
          );
        }
      } catch (error) {
        console.tron.log(error);
        toast.error(
          `Aluno não cadastrado: ${error.response.data.messages[0].errors[0]}`
        );
      }
    }
  }

  function handleShowEdit(student) {
    console.tron.log('handleShowEdit', student);
    history.push('/students/show/edit', {
      student,
      currentPage,
    });
  }

  function handleSortOrder(field, order) {
    let tempNameOrder = nameOrder;
    let tempEmailOrder = emailOrder;
    let tempBirthdayOrder = birthdayOrder;

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
    if (field === 'email') {
      if (order === tempEmailOrder) {
        setEmailOrder('');
        tempEmailOrder = '';
      } else if (order === 'asc') {
        setEmailOrder('asc');
        tempEmailOrder = 'asc';
      } else {
        setEmailOrder('desc');
        tempEmailOrder = 'desc';
      }
    }
    if (field === 'birthday') {
      if (order === tempBirthdayOrder) {
        setBirthdayOrder('');
        tempBirthdayOrder = '';
      } else if (order === 'asc') {
        setBirthdayOrder('asc');
        tempBirthdayOrder = 'asc';
      } else {
        setBirthdayOrder('desc');
        tempBirthdayOrder = 'desc';
      }
    }

    loadStudents({
      page: currentPage,
      query: currentQuery,
      name: tempNameOrder,
      email: tempEmailOrder,
      birthday: tempBirthdayOrder,
    });
  }

  return (
    <>
      <Create
        show={showCreate}
        handleClose={handleClose}
        handleSave={handleCreateStudent}
      />
      <Content>
        <Header>
          <h1>Gerenciando alunos</h1>
          <DivBoxRow>
            <button type="button" onClick={handleShowCreate}>
              <MdAdd color="#fff" size={20} />
              Cadastrar
            </button>

            <label className="search" htmlFor="search">
              <MdSearch color="#444" size={16} />
              <input
                type="text"
                placeholder="Buscar aluno"
                onChange={handleQueryChange}
              />
            </label>
          </DivBoxRow>
        </Header>

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
                      color={nameOrder === 'desc' ? '#000' : '#ccc'}
                      size={20}
                      onClick={() => handleSortOrder('name', 'desc')}
                    />
                    <MdArrowDownward
                      color={nameOrder === 'asc' ? '#000' : '#ccc'}
                      size={20}
                      onClick={() => handleSortOrder('name', 'asc')}
                    />
                    Nome
                  </th>
                  <th width="250" className="text-left">
                    <MdArrowUpward
                      color={emailOrder === 'desc' ? '#000' : '#ccc'}
                      size={20}
                      onClick={() => handleSortOrder('email', 'desc')}
                    />
                    <MdArrowDownward
                      color={emailOrder === 'asc' ? '#000' : '#ccc'}
                      size={20}
                      onClick={() => handleSortOrder('email', 'asc')}
                    />
                    E-mail
                  </th>
                  <th width="100">
                    <MdArrowUpward
                      color={birthdayOrder === 'desc' ? '#000' : '#ccc'}
                      size={20}
                      onClick={() => handleSortOrder('birthday', 'desc')}
                    />
                    <MdArrowDownward
                      color={birthdayOrder === 'asc' ? '#000' : '#ccc'}
                      size={20}
                      onClick={() => handleSortOrder('birthday', 'asc')}
                    />
                    Idade
                  </th>
                  <th width="100" />
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td className="text-center">{s.age}</td>
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
                          handleDeleteStudent(s);
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
      </Content>
    </>
  );
}

Student.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      currentPage: PropTypes.string,
    }),
  }),
};

Student.defaultProps = {
  location: {},
};
