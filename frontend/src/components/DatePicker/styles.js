import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';

export const Container = styled.div`
  .react-datepicker__navigation {
    background: none;
    width: 0;
    padding: 0;
    border: 0.45rem solid transparent;
    height: 10px;
  }

  .react-datepicker__week {
    padding: 0;
    display: block;
  }

  .react-datepicker__navigation--previous {
    border-right-color: #ccc;
  }
  .react-datepicker__navigation--next {
    border-left-color: #ccc;
  }

  .react-datepicker__navigation--previous:hover {
    border-right-color: #b3b3b3;
    background: none;
  }
  .react-datepicker__navigation--next:hover {
    border-left-color: #b3b3b3;
    background: none;
  }

  .react-datepicker__navigation--next--with-time:not(.react-datepicker__navigation--next--with-today-button) {
    right: 90px;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    font-size: 1rem;
  }

  .react-datepicker__day {
    font-size: 1.2rem;
  }

  > span {
    margin-left: 10px;
    font-size: 1.2rem;
    font-stretch: italic;
    text-transform: none;
    color: var(--color-error);
  }
`;
