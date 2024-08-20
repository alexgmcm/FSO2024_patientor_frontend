import type { Entry } from "../../types";

const Entry = ({entry, diagnosesMap} : {entry: Entry, diagnosesMap: Map<string,string>}) => {
    return (<div>
{entry.date} <i>{entry.description}</i>
<ul>{entry.diagnosisCodes?.map((code) => <li key={code}> {code}: {diagnosesMap.get(code)} </li> )}</ul>
    </div>);
};

export default Entry;