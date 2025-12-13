import Color from "colorjs.io";
import { useCallback, useEffect, useState } from "react";

type ColorScheme = 'light' | 'dark' | 'no-preference';

const usePreferredColorScheme = () => {
    // Define the media query strings
    const darkQuery = '(prefers-color-scheme: dark)';
    const lightQuery = '(prefers-color-scheme: light)';

    // Function to get the current scheme from window.matchMedia
    const getScheme = ():ColorScheme => {
        if (typeof window === 'undefined') {
            return 'no-preference';
        }

        const isDark = window.matchMedia(darkQuery).matches;
        const isLight = window.matchMedia(lightQuery).matches;
        if (isDark) return 'dark';
        if (isLight) return 'light';
        return 'no-preference';
    };

    // Function to get current computed styles object
    const getComputedStyles = useCallback(():CSSStyleDeclaration => {
        const styles = window.getComputedStyle(document.body);
        return styles;
    }, []);

    // Function to convert CSS color variable to hex code
    const colorToHex = useCallback((cssVar:string):string => {
        const styles = getComputedStyles();
        const val = styles.getPropertyValue(cssVar);
        if (val === '') {
            console.warn(`CSS variable not found: ${cssVar}`);
            return "#000000";
        }

        // Create new color object
        const color = new Color(val);

        // Convert to hex
        const hex = color.to('srgb').toString({ format: 'hex' });
        return hex;
    }, []);

    // Init state
    const [scheme, setScheme] = useState<ColorScheme>(getScheme);

    // Set up listener
    useEffect(() => {
        const mediaQueryList = window.matchMedia(darkQuery);

        // Handler for when darkQuery changes
        const handleChange = () => {
            const s = getScheme();
            switch (s) {
                case 'light':
                    setScheme('light');
                    break;

                case 'dark':
                    setScheme('dark');
                    break;
            
                default:
                    setScheme('light');
                    break;
            }
        };

        // Add event listener
        mediaQueryList.addEventListener('change', handleChange);

        // Cleanup on unmount
        return () => {
            mediaQueryList.removeEventListener('change', handleChange);
        };
    }, [darkQuery]);

    return {scheme, getComputedStyles, colorToHex};
};

export default usePreferredColorScheme;