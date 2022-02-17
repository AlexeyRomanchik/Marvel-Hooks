import { useHttp } from "../hooks/useHttp";

const useMarvelService = () => {
    const { loading, error, request } = useHttp(),
        _apiBase = 'https://gateway.marvel.com:443/v1/public/',
        _apiKey = 'apikey=e15e2a709e9b6865533173c2d91af693',
        _characterStartOffset = 210;

    const getAllCharacters = async (offset = _characterStartOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
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

    return { getAllCharacters, getCharacter, loading, error };
}

export default useMarvelService;