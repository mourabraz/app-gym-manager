import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import pt from 'date-fns/locale/pt';
import { useField } from '@rocketseat/unform';

import { Container } from './styles';

export default function DatePicker({ onChange, ...rest }) {
  registerLocale('pt', pt);
  const ref = useRef();

  const { registerField, error } = useField('birthday');

  const [selected, setSelected] = useState(new Date());

  useEffect(() => {
    if (ref.current) {
      registerField({
        name: 'birthday',
        ref: ref.current,
        path: 'props.selected',
        clearValue: pickerRef => {
          pickerRef.clear();
        },
      });
    }
  }, [ref.current]); // eslint-disable-line

  return (
    <Container>
      <ReactDatePicker
        locale="pt"
        name="birthday"
        selected={selected}
        onChange={date => {
          setSelected(date);
          onChange(date);
        }}
        ref={ref}
        dateFormat="dd/MM/yyyy"
        {...rest}
      />
      {error && <span>{error}</span>}
    </Container>
  );
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
};
