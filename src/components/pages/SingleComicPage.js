import { useParams, Link } from 'react-router-dom';
import './singleComicPage.scss';
import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import { state } from '../../hooks/useHttp';
import { setContent } from '../../utils/setContent';

const SingleComicPage = () => {
    const [comics, setComics] = useState(null),
        { getComics, loading, error, process, setProcess } = useMarvelService(),
        { id } = useParams("id");

    useEffect(() => {
        updateComics();
    }, [id]);

    const updateComics = () => {
        getComics(id)
            .then(onComicsLoaded)
            .then(() => setProcess(state.confirmed))
    }

    const onComicsLoaded = (comics) => {
        setComics(comics);
    }

    return (
        <>
            {setContent(process, SingleComicView, comics)}
        </>
    )
}

const SingleComicView = ({ data }) => {
    const { title, description, pageCount, thumbnail, language, price } = data;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;