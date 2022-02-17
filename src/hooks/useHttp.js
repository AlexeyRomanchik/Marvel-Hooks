import { useState, useCallback } from "react"

export const useHttp = () => {
    const [loading, setLoading] = useState(false),
        [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null,
        headers = { 'Content-Type': 'application/json' }) => {

        setError(null);
        setLoading(true);

        try {
            const response = await fetch(url, { method, body, headers })

            if (!response.ok) {
                throw new Error(`Could not get ${url}, status ${response.status}`);
            }

            return await response.json();
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, request };
}