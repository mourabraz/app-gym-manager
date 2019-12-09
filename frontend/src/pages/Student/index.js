/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import {
  MdAdd,
  MdSearch,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';

import api from '~/services/api';

import CreateEdit from './Modal/CreateEdit';

import {
  Content,
  Header,
  TableBox,
  ButtonPagination,
  EmptyTable,
  DivBoxRow,
} from './styles';

export default function Student() {
  const limit = 2;
  const timer = useRef(null);

  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [students, setStudents] = useState([]);

  const [showCreateEdit, setShowCreateEdit] = useState(true);

  async function loadStudents({ page = 1, query = '' } = {}) {
    const response = await api.get(
      `/students?page=${page}&limit=${limit}&q=${query}`
    );

    const {
      students: _students,
      page: _page,
      total: _total,
      last_page: _lastPage,
    } = response.data;

    console.tron.log(`loadSturents called`, response.data);

    setStudents(_students);
    setTotal(_total);
    setCurrentPage(_page);

    setIsFirstPage(page === 1);
    setIsLastPage(page === _lastPage);
  }

  useEffect(() => {
    loadStudents();
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
      loadStudents({ page, query: currentQuery });
    }
  }

  function handleNext() {
    if (!isLastPage) {
      const page = Number(currentPage) + 1;
      setCurrentPage(page);
      loadStudents({ page, query: currentQuery });
    }
  }

  function handleShowCreateEdit() {
    setShowCreateEdit(true);
  }

  function handleClose() {
    setShowCreateEdit(false);
  }

  function handleCreateStudent(student) {
    setCurrentQuery('');
    setCurrentPage(1);
    setIsFirstPage(true);
    setIsLastPage(total + 1 > limit);
    setTotal(total + 1);

    setStudents([...students, student]);
  }

  return (
    <>
      <CreateEdit
        show={showCreateEdit}
        handleClose={handleClose}
        handleSave={handleCreateStudent}
      />
      <Content>
        <Header>
          <h1>Gerenciando alunos</h1>
          <DivBoxRow>
            <button type="button" onClick={handleShowCreateEdit}>
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
                  <th className="text-left">Nome</th>
                  <th width="250" className="text-left">
                    E-mail
                  </th>
                  <th width="100">Idade</th>
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
                        onClick={() => {}}
                      >
                        editar
                      </button>
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => {}}
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
