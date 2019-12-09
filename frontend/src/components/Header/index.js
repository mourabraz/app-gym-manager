import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';

import Notifications from '~/components/Notifications';
import { signOut } from '~/store/modules/auth/actions';

import { Container, Content, ButtonBox } from './styles';

import logoLeft from '~/assets/logo/logo-l@1x.png';
import logoRight from '~/assets/logo/logo-r@1x.png';

export default function Header() {
  const dispatch = useDispatch();

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <nav>
          <Link to="/dashboard">
            <span className="logo">
              <img src={logoLeft} alt="" />
              <img src={logoRight} alt="" />
            </span>
            <span className="logoText">GYMPOINT</span>
          </Link>
          <NavLink to="/students">Alunos</NavLink>
          <NavLink to="/plans">Planos</NavLink>
          <NavLink to="/registrations">Matrículas</NavLink>
          <NavLink to="/help-orders">Pedidos de Auxílio</NavLink>
        </nav>

        <aside>
          <Notifications />

          <ButtonBox>
            <button type="button" onClick={handleSignOut}>
              Sair
            </button>
          </ButtonBox>
        </aside>
      </Content>
    </Container>
  );
}
