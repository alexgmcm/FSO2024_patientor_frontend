import { useState, SyntheticEvent } from "react";

import {  TextField,  MenuItem, Select,  Button, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from "dayjs";
import Chip from '@mui/material/Chip';
import {Box} from '@mui/material/';
import PatientsService from '../../services/patients';
import { EntryType,  HealthCheckRating, EntryWithoutId, SickLeave, Patient } from "../../types";
import FormError from "./FormError";


const EntryForm = ({id, diagnosesMap,  setPatient}: {id:string, diagnosesMap: Map<string, string>, setPatient: React.Dispatch<React.SetStateAction<Patient|null>> }) => {
    const [entryType, setEntryType] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Dayjs | null>(null);
    const [specialist, setSpecialist] = useState("");
    const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
    const [healthCheckRating, setHealthCheckRating] = useState<string>("");
    const [formError, setFormError] = useState("");
    const [employerName, setEmployerName] = useState("");
    const [sickLeaveStartDate, setSickLeaveStartDate] = useState<Dayjs|null>(null);
    const [sickLeaveEndDate, setSickLeaveEndDate] = useState<Dayjs|null>(null);
    const [discharge, setDischarge] = useState<{criteria: string, date:Dayjs|null } >({criteria:"", date: null});
   
    const stringToArray = (str:string|string[]) => {
        if (Array.isArray(str)){
            return str;
        } else {
            return [str];
        }

    };

    const allDiagnosesArray =  [...diagnosesMap].map(([code, name]) => ({ code, name }));

    const style =  {border: "dashed 4px #000"};
    const attemptAddEntry = async (newHealthCheckEntry :EntryWithoutId) => {
        try{
            const newPatientResponse = await PatientsService.addEntry(id,newHealthCheckEntry);
           
            setPatient(newPatientResponse);
            
            } catch (error) {
            let errorMessage = "Unknown error!";
            if (error instanceof Error){
                errorMessage = error.message;
            }
            setFormError(errorMessage);
            setTimeout(() => {setFormError("");},5000);
           

            }

    };

    const submitEntry = (event:SyntheticEvent) => {
        event.preventDefault();
        const typedEntryType = EntryType[entryType as keyof typeof EntryType];
       
        if (!date){
            setFormError("No date entered!");
           setTimeout(() => setFormError(""),5000);
           return;
           //throw new Error("No date entered!");
        }
        const strDate = date.format('YYYY-MM-DD');
        const newBaseEntry = { description, date: strDate, specialist, diagnosisCodes};
        
        if(entryType===EntryType.HealthCheck){
            const healthCheckEntryType = typedEntryType as EntryType.HealthCheck;
           const typedHealthCheckRating = HealthCheckRating[healthCheckRating as keyof typeof HealthCheckRating];
            
            const newHealthCheckEntry = {...newBaseEntry, healthCheckRating: typedHealthCheckRating, type: healthCheckEntryType };
            attemptAddEntry(newHealthCheckEntry);
        }

        if(entryType===EntryType.OccupationalHealthcare){
            const occupationalHealthcareEntryType = typedEntryType as EntryType.OccupationalHealthcare;
            const newOccupationalHealthcareEntry = {...newBaseEntry, employerName, type: occupationalHealthcareEntryType };
                if (sickLeaveEndDate != null && sickLeaveStartDate != null){
                    const sickLeave = {startDate: sickLeaveStartDate.format('YYYY-MM-DD'),
                                        endDate:  sickLeaveEndDate.format('YYYY-MM-DD') } as SickLeave;
                   const newOccupationalHealthcareEntrySick = {...newOccupationalHealthcareEntry, sickLeave: sickLeave};
                   attemptAddEntry(newOccupationalHealthcareEntrySick);
                }
                else {
            attemptAddEntry(newOccupationalHealthcareEntry);
                }
        }

        if(entryType===EntryType.Hospital){
            const hospitalEntryType = typedEntryType as EntryType.Hospital;
            if (!discharge.date){
                setFormError("No discharge date entered!");
           setTimeout(() => setFormError(""),5000);
           return;
        }
            const newHospitalEntry = {...newBaseEntry, discharge: {date: discharge.date.format('YYYY-MM-DD'), criteria: discharge.criteria}, type: hospitalEntryType };
            attemptAddEntry(newHospitalEntry);
        }

    };

    let healthCheckField = <></>;
    if (entryType===EntryType.HealthCheck){
        healthCheckField = <div>
        <InputLabel id="healthCheck">Health Check Rating</InputLabel>
        <Select label="Health Check Rating"
        labelId="healthCheck"
        value={healthCheckRating}
        onChange={(e) => setHealthCheckRating(e.target.value)}
        >
        
     
       {Object.keys(HealthCheckRating).filter(k => Number.isNaN(Number(k))).map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
         </Select> </div>;
    }

    let occupationalHealthcareFields = <></>;
    if (entryType===EntryType.OccupationalHealthcare){
        occupationalHealthcareFields = <div>
        <div>
        <TextField
          label="Employer Name" 
          value={employerName}
          onChange={({ target }) => setEmployerName(target.value)}
        />
        </div>
        <div>
        <DatePicker
        label="Sick Leave Start Date"
        value={date}
        onChange={(newValue) => setSickLeaveStartDate(newValue)}
        />
        </div><div>
        <DatePicker
        label="Sick Leave End Date"
        value={date}
        onChange={(newValue) => setSickLeaveEndDate(newValue)}
        />
        </div>
        </div>;
    }

    let hospitalFields = <></>;
    if(entryType===EntryType.Hospital){
    hospitalFields = <div>
        <div>
        <DatePicker
        label="Hospital Discharge Date"
        value={discharge?.date}
        onChange={(newValue) => setDischarge({...discharge, date: newValue})}
        />
        </div>
        <div>
        <TextField
          label="Hospital Discharge Criteria" 
          value={discharge.criteria}
          onChange={({ target }) => setDischarge({...discharge, criteria: target.value})}
        />
        </div>

    </div>;


    }


    return (<div style={style}>
        <h3>New Entry</h3>
        <FormError formError={formError}/>
        <form onSubmit={submitEntry}>

        <div>
            <InputLabel id="entryType">Entry Type</InputLabel>
            <Select 
                labelId="entryType"
                label="Entry Type"
                value={entryType}
                onChange={(e) => setEntryType(e.target.value)}
                
            >
                {Object.keys(EntryType).map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select> 
        </div>

        
        <div>
        <TextField
          label="Description" 
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        </div>

        <div>
        <DatePicker
        label="Date"
        value={date}
        onChange={(newValue) => setDate(newValue)}
        />
        </div>

        <div>
        <TextField
          label="Specialist" 
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        </div>
        <div>
        <InputLabel id="diagnosisCodes">Diagnosis Codes</InputLabel>
        <Select label="Diagnosis Codes"
        labelId="diagnosisCodes"
         multiple
         value={diagnosisCodes}
         onChange={(e) => setDiagnosisCodes(stringToArray(e.target.value))}
         renderValue={(selected: string[]) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )} >
        {allDiagnosesArray.map((d) => <MenuItem key={d.code} value={d.code}>{d.code} - {d.name}</MenuItem>)}
          </Select>
          </div>

        {healthCheckField}
        {occupationalHealthcareFields}
        {hospitalFields}

        <Button
              type="submit"
              variant="contained"
            > Submit
            </Button>
        </form>
    </div>);
};

export default EntryForm;


