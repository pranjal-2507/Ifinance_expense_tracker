import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-reveal animations using IntersectionObserver.
 * Inspired by aceternity.com scroll reveal patterns.
 * 
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1), default 0.15
 * @param {string} options.rootMargin - Observer root margin, default '0px'
 * @param {boolean} options.triggerOnce - Only trigger once, default true
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
export function useScrollReveal({
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
} = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isVisible };
}

/**
 * Generates className string for scroll-reveal animations.
 * 
 * @param {boolean} isVisible - Whether element is visible
 * @param {string} direction - Animation direction: 'up' | 'down' | 'left' | 'right' | 'scale'
 * @param {number} delay - Animation delay in ms
 * @returns {string} CSS class string
 */
export function getRevealClass(isVisible, direction = 'up', delay = 0) {
    const baseClass = 'transition-all duration-700 ease-out';
    const delayStyle = delay ? `delay-[${delay}ms]` : '';

    const hiddenStates = {
        up: 'translate-y-8 opacity-0',
        down: '-translate-y-8 opacity-0',
        left: 'translate-x-8 opacity-0',
        right: '-translate-x-8 opacity-0',
        scale: 'scale-90 opacity-0',
    };

    const visibleState = 'translate-y-0 translate-x-0 scale-100 opacity-100';

    return `${baseClass} ${delayStyle} ${isVisible ? visibleState : hiddenStates[direction] || hiddenStates.up}`;
}

/**
 * A simpler hook that returns multiple refs for staggered animations.
 * 
 * @param {number} count - Number of items to animate
 * @param {Object} options - Observer options
 * @returns {Array<{ ref: React.RefObject, isVisible: boolean }>}
 */
export function useStaggeredReveal(count, options = {}) {
    const items = Array.from({ length: count }, () => useScrollReveal(options));
    return items;
}

export default useScrollReveal;
