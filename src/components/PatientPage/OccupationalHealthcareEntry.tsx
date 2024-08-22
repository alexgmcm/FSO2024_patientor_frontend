import type { OccupationalHealthcareEntry } from "../../types";
import BadgeIcon from '@mui/icons-material/Badge';
const OccupationalHealthcareEntry = ({entry, diagnosesMap} : {entry: OccupationalHealthcareEntry, diagnosesMap: Map<string,string>}) => {
const sickLeavePart = entry.sickLeave ? `On sick leave from ${entry.sickLeave.startDate} to ${entry.sickLeave.endDate}` : "";
   
    const diagnosesPart = entry.diagnosisCodes ? <><h3>Diagnoses</h3>
        <ul>{entry.diagnosisCodes?.map((code) => <li key={code}> {code}: {diagnosesMap.get(code)} </li> )}</ul></> : <></>;

        return (<> {entry.date} <BadgeIcon/><br/>
        <i>{entry.description}</i><br/>
        Employer: {entry.employerName} <br/>
        {sickLeavePart}{entry.sickLeave ? <br/> : <></>} 

        Diagnosed by: {entry.specialist} <br/>
        {diagnosesPart}
        </>);
};


export default OccupationalHealthcareEntry;