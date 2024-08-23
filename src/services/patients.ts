import axios, { AxiosError } from "axios";
import {  EntryWithoutId, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const getOne = async (id: string) => {
  const {data} = await axios.get<Patient>(
     `${apiBaseUrl}/patients/${id}`
  );
  return data;

};

const addEntry = async (id:string, entry: EntryWithoutId) => {
  try {
  const {data} = await axios.post<Patient>(`${apiBaseUrl}/patients/${id}/entries`, entry);
  return data;
} catch (error) {
  let errorMessage = "Unknown error!";
  if (error instanceof AxiosError && error.response) {
    errorMessage = error.response.data;
  }
  throw new Error(errorMessage);
  
  
}
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

export default {
  getAll, create, getOne, addEntry
};

