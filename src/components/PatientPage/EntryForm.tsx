import { useState, SyntheticEvent } from "react";

import {  TextField,  MenuItem, Select,  Button, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from "dayjs";
import Chip from '@mui/material/Chip';
import {Box} from '@mui/material/';
import PatientsService from '../../services/patients';
import { EntryType,  HealthCheckRating, EntryWithoutId } from "../../types";
import FormError from "./FormError";


const EntryForm = ({id, diagnosesMap}: {id:string, diagnosesMap: Map<string, string>}) => {
    const [entryType, setEntryType] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Dayjs | null>(null);
    const [specialist, setSpecialist] = useState("");
    const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
    const [healthCheckRating, setHealthCheckRating] = useState<string>("");
    const [formError, setFormError] = useState("");
   
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
            await PatientsService.addEntry(id,newHealthCheckEntry);
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
        const strDate = date?.format('YYYY-MM-DD');
        if (!strDate){
            throw new Error ("no date!");
        }
        const newBaseEntry = { description, date: strDate, specialist, diagnosisCodes};
        
        if(entryType==="HealthCheck"){
            const healthCheckEntryType = typedEntryType as EntryType.HealthCheck;
           const typedHealthCheckRating = HealthCheckRating[healthCheckRating as keyof typeof HealthCheckRating];
            
            const newHealthCheckEntry = {...newBaseEntry, healthCheckRating: typedHealthCheckRating, type: healthCheckEntryType };
            attemptAddEntry(newHealthCheckEntry);
            

        }

    };

    let healthCheckField = <></>;
    if (entryType==="HealthCheck"){
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

        <Button
              type="submit"
              variant="contained"
            > Submit
            </Button>
        
        


        </form>

        


    </div>);
};

export default EntryForm;


