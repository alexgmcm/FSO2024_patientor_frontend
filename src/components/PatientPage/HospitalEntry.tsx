import type { HospitalEntry } from "../../types";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
const HospitalEntry = ({entry, diagnosesMap} : {entry: HospitalEntry, diagnosesMap: Map<string,string>}) => {
   
   
   
   
    const diagnosesPart = entry.diagnosisCodes ? <><h3>Diagnoses</h3>
        <ul>{entry.diagnosisCodes?.map((code) => <li key={code}> {code}: {diagnosesMap.get(code)} </li> )}</ul></> : <></>;

        return (<> {entry.date} <LocalHospitalIcon/><br/>
        <i>{entry.description}</i><br/>
        Discharged on {entry.discharge.date} <br/>
        Discharge criteria: <i>{entry.discharge.criteria}</i> <br/>
        Diagnosed by: {entry.specialist} <br/>
        {diagnosesPart}
        </>);
};

export default HospitalEntry;