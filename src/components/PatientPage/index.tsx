import { useEffect, useState } from "react";
import { Patient } from "../../types";
import PatientsService from '../../services/patients';
import TransgenderIcon from '@mui/icons-material/Transgender';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import {
    useParams
  } from 'react-router-dom';
const PatientPage = () => {
const [patient, setPatient] = useState<Patient | null>(null);
const id = useParams().id;

const setPatientInfo = async (id: string) =>{
    try {
    const patientInfo = await PatientsService.getOne(id);
    setPatient(patientInfo);
    } catch (err) {
        console.log(err);
    }
};

useEffect(() => {
if (id){
setPatientInfo(id);
} else {
console.log("No id!");
}
},[]);

if (patient===null){
    return ("Null patient");
} else {

const genderIcon = patient.gender==="male" ? <MaleIcon /> : patient.gender === "female" ? <FemaleIcon /> : <TransgenderIcon />;

return (
<>
<div><h1>{patient.name}  {genderIcon} </h1></div>
ssn: {patient.ssn} <br />
occupation: {patient.occupation}
</>

);
}


};


export default PatientPage;