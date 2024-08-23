import type { Entry } from "../../types";
import { EntryType } from "../../types";
import HealthCheckEntry from "./HealthCheckEntry";
import HospitalEntry from "./HospitalEntry";
import OccupationalHealthcareEntry from "./OccupationalHealthcareEntry";

const assertNever = (v: never): never => {
    throw new Error ("unexpected value:" + v);
};
const styles = {
    border: '1px solid rgba(0, 0, 0, 0.5)', 
};

const Entry = ({entry, diagnosesMap} : {entry: Entry, diagnosesMap: Map<string,string>}) => {

switch (entry.type){
case EntryType.Hospital:
    return <div style={styles}><HospitalEntry entry={entry} diagnosesMap={diagnosesMap}/></div>;
case  EntryType.OccupationalHealthcare:
    return <div style={styles}><OccupationalHealthcareEntry entry={entry} diagnosesMap={diagnosesMap} /></div>;
case  EntryType.HealthCheck:
    return <div style={styles}><HealthCheckEntry entry={entry} diagnosesMap={diagnosesMap} /></div>;
default:
    return assertNever(entry);

}
   
};

export default Entry;