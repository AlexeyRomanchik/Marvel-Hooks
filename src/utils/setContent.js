import Skeleton from '../components/skeleton/Skeleton';
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Spinner from '../components/spinner/Spinner';
import { state } from '../hooks/useHttp';


export const setContent = (process, Component, data) => {
    switch (process) {
        case state.waiting:
            return <Skeleton />;
        case state.loading:
            return <Spinner />;
        case state.confirmed:
            return <Component data={data} />;
        case state.error:
            return <ErrorMessage />;
        default:
            throw Error('Unexpected process state');
    }
}