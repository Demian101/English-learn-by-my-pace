import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  useGetwordsQuery,
  useGetwordByIdQuery,
  useDelwordMutation,
  useAddwordMutation,
  useUpdatewordMutation,
} from "../store/api/wordsApi";

const ReduxTest = () => {
  const inputData = {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  };
  const [addWord, { isSuccess: isAddSuccess }] = useAddwordMutation();

  const submitHandler = () => {
    addWord(inputData);
  };
  return (
    <>
      <button onClick={submitHandler}> Submit </button>
    </>
  );
};
export default ReduxTest;