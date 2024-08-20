import type { Entry } from "../../types";

const Entry = ({entry} : {entry: Entry}) => {
    return (<div>
{entry.date} <i>{entry.description}</i>
<ul>{entry.diagnosisCodes?.map((code) => <li key={code}> {code} </li> )}</ul>
    </div>);
};

export default Entry;