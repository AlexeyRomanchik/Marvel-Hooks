import { useHttp } from "../hooks/useHttp";

const useMarvelService = () => {
    const { request, process, setProcess } = useHttp(),
        _apiBase = 'https://gateway.marvel.com:443/v1/public/',
        _apiKey = 'apikey=e15e2a709e9b6865533173c2d91af693',
        _offset = 210;

    const getAllCharacters = async (offset = _offset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = _offset) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (character) => {
        const topComics = character.comics.items.slice(0, 10);

        return {
            id: character.id,
            name: character.name,
            description: character.description ? `${character.description.slice(0, 210)} ...` :
                'There is no description for this character',
            thunbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: topComics
        };
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices.price ? `${comics.prices.price}$` : 'not available'
        };
    }

    return {
        getAllCharacters,
        getCharacter,
        getAllComics,
        getComics,
        process,
        setProcess
    };
}

export default useMarvelService;