import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const FormError = ({formError}: {formError :string}) => {
    const style = {backgroundColor: "#fd8f8f"};
    const errorDisplay = <div style={style}> <WarningAmberIcon/> {formError} </div>;
    const show = formError != "" ? errorDisplay : <></>;
    return (
        show

    );
};

export default FormError;