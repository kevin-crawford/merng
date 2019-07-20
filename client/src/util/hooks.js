import { useState } from "react";

// custom hook for forms
export const useForm = (callback, initialState) => {
  // takes inititial state from component it is being used in
  // values is set by the initial state we provided
  // we can set these values using the setValues method from hook
  const [values, setValues] = useState(initialState);

  // onChange event handler that will set values from initial state
  // spread all values into setValues argument
  // modify values by grabbing the events name and setting the events value from inputs
  const onChange = event => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // onSubmit handler that will call the callback passed in argument
  // prevent events default behavior
  const onSubmit = event => {
    event.preventDefault();
    callback();
  };

  // return onChange, onSubmit functions, and return values that have been modified from hook
  return {
    onChange,
    onSubmit,
    values
  };
};
