import { useEffect, useState } from "react";
import { Diagnosis, Patient } from "../../types";
import PatientsService from '../../services/patients';
import DiagnosesService from '../../services/diagnoses';
import TransgenderIcon from '@mui/icons-material/Transgender';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import Entry from "./Entry";
import EntryForm from "./EntryForm";

import {
    useParams
  } from 'react-router-dom';
const PatientPage = () => {
const [patient, setPatient] = useState<Patient | null>(null);
const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
const id = useParams().id;
if (!id){
    throw new Error("Could not extract id!");
}


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
},[id]);

const setDiagnosesAsync = async () => {
const diagnoses = await DiagnosesService.getAll();
setDiagnoses(diagnoses);
};


useEffect(()=> {
try {
setDiagnosesAsync();
} catch {
    console.log("Could not fetch diagnoses!");
}

},[]);

const diagnosesMap = new Map();
diagnoses.forEach((x) => diagnosesMap.set(x.code,x.name) );

if (patient===null){
    return ("Null patient");
} else {

const genderIcon = patient.gender==="male" ? <MaleIcon /> : patient.gender === "female" ? <FemaleIcon /> : <TransgenderIcon />;

return (
<>
<div><h1>{patient.name}  {genderIcon} </h1></div>
ssn: {patient.ssn} <br />
occupation: {patient.occupation}
<div>
<EntryForm id={id} diagnosesMap={diagnosesMap} />
<h2>entries</h2>
{patient.entries.map((entry) => <Entry key={entry.id} entry={entry} diagnosesMap={diagnosesMap}/>)}

</div>
</>

);
}


};


export default PatientPage;