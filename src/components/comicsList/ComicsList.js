import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {
    const [comics, setComics] = useState([]),
        [itemsLoading, setItemsLoading] = useState(false),
        [offset, setOffset] = useState(210),
        [comicsEnded, setComicsEnded] = useState(false),
        { getAllComics, loading, error } = useMarvelService();

    useEffect(() => {
        updateComics(offset, true);
    }, []);

    const updateComics = (offset, first) => {
        setItemsLoading(!first);
        getAllComics(offset).then(onComicsLoaded);
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

    const renderComicsList = (comicsList) => {
        const comicsListItems = comicsList.map(comics => {
            return (
                <li className="comics__item"
                    key={comics.id}>
                    <a href="#">
                        <img src={comics.thumbnail} alt="ultimate war" className="comics__item-img" />
                        <div className="comics__item-name">{comics.title}</div>
                        <div className="comics__item-price">{comics.price}</div>
                    </a>
                </li>
            );
        });
        return (
            <ul className="comics__grid">
                {comicsListItems}
            </ul>
        );
    }

    const comicsList = renderComicsList(comics);

    const errorMessage = error ? <ErrorMessage /> : null,
        spinner = loading && !itemsLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {comicsList}
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