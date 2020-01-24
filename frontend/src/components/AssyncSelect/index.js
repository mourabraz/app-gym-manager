import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';

import { useField } from '@rocketseat/unform';

import { Container } from './styles';

export default function AssyncSelect({
  name,
  label,
  promiseOptions,
  options,
  disabled,
}) {
  const ref = useRef(null);
  const { fieldName, registerField, error } = useField(name);

  const [value, setValue] = useState('');

  function parseSelectValue(selectRef) {
    return selectRef.props.value.value || '';
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'select.state.value',
      parseValue: parseSelectValue,
      clearValue: selectRef => {
        selectRef.select.clearValue();
      },
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  function changeSelection(_value) {
    setValue(_value);
  }

  return (
    <Container>
      {label && <label htmlFor={fieldName}>{label}</label>}
      <AsyncSelect
        name={fieldName}
        aria-label={fieldName}
        ref={ref}
        // isClearable
        cacheOptions
        value={value}
        loadOptions={promiseOptions}
        defaultOptions={options}
        isDisabled={disabled}
        onChange={e => changeSelection(e)}
        noOptionsMessage={() => 'Nenhum registro encontrado'}
        loadingMessage={() => 'Carregando...'}
        getOptionValue={option => option.value}
        getOptionLabel={option => option.label}
      />

      {error && <span>{error}</span>}
    </Container>
  );
}

AssyncSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  promiseOptions: PropTypes.func.isRequired,
  options: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  disabled: PropTypes.bool,
};

AssyncSelect.defaultProps = {
  disabled: false,
  options: true, // [{ id: 0, label: 'Digite as primeiras letras do nome do aluno' }],
};
