import { useState, useCallback } from "react"

export const state = {
    waiting: 'waiting',
    loading: 'loading',
    confirmed: 'confirmed',
    error: 'error'
}

export const useHttp = () => {
    const [process, setProcess] = useState(state.waiting);

    const request = useCallback(async (url, method = 'GET', body = null,
        headers = { 'Content-Type': 'application/json' }) => {

        setProcess(state.loading);

        try {
            const response = await fetch(url, { method, body, headers })

            if (!response.ok) {
                throw new Error(`Could not get ${url}, status ${response.status}`);
            }

            return await response.json();
        } catch (e) {
            setProcess(state.error);
            throw e;
        }
    }, []);

    return { request, process, setProcess };
}