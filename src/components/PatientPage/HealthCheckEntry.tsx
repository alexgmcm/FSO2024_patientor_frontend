import type { HealthCheckEntry } from '../../types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WarningIcon from '@mui/icons-material/Warning';

const HealthCheckEntry = ({entry, diagnosesMap} : {entry: HealthCheckEntry, diagnosesMap: Map<string,string>}) => {
    const healthStatusIconMap = new Map([
        [0,<FavoriteIcon color="success"/>],
        [1, <FavoriteIcon color="warning"/>],
        [2, <FavoriteIcon color="error"/>],
        [3, <WarningIcon color="error"/>]
    ]);

    const healthStatusStringMap = new Map([
        [0,"Healthy"],
        [1, "Low Risk"],
        [2,"High Risk"],
        [3, "Critical Risk!"]
    ]);

    const diagnosesPart = entry.diagnosisCodes ? <><h3>Diagnoses</h3>
        <ul>{entry.diagnosisCodes?.map((code) => <li key={code}> {code}: {diagnosesMap.get(code)} </li> )}</ul></> : <></>;

        return (<> {entry.date} <CheckCircleIcon/><br/>
        <i>{entry.description}</i><br/>
        Health Status: {healthStatusIconMap.get(entry.healthCheckRating)} {healthStatusStringMap.get(entry.healthCheckRating)} <br/>
        Diagnosed by: {entry.specialist} <br/>
        {diagnosesPart}
        </>);
};

export default HealthCheckEntry;