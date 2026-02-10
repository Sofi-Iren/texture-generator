import { useState, useEffect } from 'react';

// Хук принимает CSS-запрос и возвращает true/false
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // 1. Создаём MediaQueryList объект
        const media = window.matchMedia(query);

        // 2. Функция, которая обновляет состояние
        const updateMatches = () => {
            setMatches(media.matches);
        };

        // 3. Устанавливаем начальное значение
        updateMatches();

        // 4. Подписываемся на изменения
        media.addEventListener('change', updateMatches);

        // 5. Убираем подписку при размонтировании компонента
        return () => {
            media.removeEventListener('change', updateMatches);
        };
    }, [query]); // Зависимость: если query изменится, хук переподпишется

    return matches; // Возвращаем текущее состояние
}