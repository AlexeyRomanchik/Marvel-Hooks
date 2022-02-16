
class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=e15e2a709e9b6865533173c2d91af693';
    _characterStartOffset = 210;

    getResource = async (url) => {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Could not get ${url}, status ${response.status}`);
        }

        return await response.json();
    }

    getAllCharacters = async (offset = this._characterStartOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (character) => {
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
}

export default MarvelService