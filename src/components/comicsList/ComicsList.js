import './comicsList.scss';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import { Link } from 'react-router-dom';
import { state } from '../../hooks/useHttp';

const setContent = (process, Component, itemsLoading) => {
    switch (process) {
        case state.waiting:
            return <Spinner />;
        case state.loading:
            return itemsLoading ? <Component /> : <Spinner />;
        case state.confirmed:
            return <Component />;
        case state.error:
            return <ErrorMessage />;
        default:
            throw Error('Unexpected process state');
    }
}

const ComicsList = () => {
    const [comics, setComics] = useState([]),
        [itemsLoading, setItemsLoading] = useState(false),
        [offset, setOffset] = useState(210),
        [comicsEnded, setComicsEnded] = useState(false),
        { getAllComics, process, setProcess } = useMarvelService();

    useEffect(() => {
        updateComics(offset, true);
    }, []);

    const updateComics = (offset, first) => {
        setItemsLoading(!first);
        getAllComics(offset)
            .then(onComicsLoaded)
            .then(() => setProcess(state.confirmed));
    }

    const onComicsLoaded = (comicsNew) => {
        const ended = comicsNew.length < 8;

        setComics(comics => (
            [...comics, ...comicsNew]
        ));
        setItemsLoading();
        setOffset(offset => offset + 9);
        setComicsEnded(ended);
    }

    const renderComicsList = (data) => {
        const comicsListItems = data.map(comics => {
            return (
                <li className="comics__item"
                    key={comics.id}>
                    <Link to={`/comics/${comics.id}`}>
                        <img src={comics.thumbnail} alt="ultimate war" className="comics__item-img" />
                        <div className="comics__item-name">{comics.title}</div>
                        <div className="comics__item-price">{comics.price}</div>
                    </Link>
                </li>
            );
        });
        return (
            <ul className="comics__grid">
                {comicsListItems}
            </ul>
        );
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderComicsList(comics), itemsLoading)}
            <button className="button button__main button__long"
                disabled={itemsLoading}
                onClick={() => updateComics(offset)}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;