import { vars } from 'nativewind'

export const colors = {
    light: {
        primary: '#52276C',
        primaryContent: '#FFFFFF',
        secondary: '#E6CCFF',
        secondaryContent: '#E0E0E0',
        tertiary: '#F0E6F7',
        tertiaryContent: '#000000',
        error: '#C0392B',
        errorContent: '#FFFFFF',
        success: '#27AE60',
        successContent: '#FFFFFF',
        background: '#F4F6FB',
        backgroundColor: '#4A4A4A',
        surface: '#FFFFFF',
        surfaceContent: '#4A4A4A'
    },
    dark: {
        primary: '#52276C',
        primaryContent: '#FFFFFF',
        secondary: '#2C2C2C',
        secondaryContent: '#FFFFFF',
        tertiary: '#3A1F4C',
        tertiaryContent: '#FFFFFF',
        error: '#FF6B6B',
        errorContent: '#000000',
        success: '#6BFF8E',
        successContent: '#000000',
        background: '#121212',
        backgroundColor: '#E0E0E0',
        surface: '#1E1E1E',
        surfaceContent: '#E0E0E0'
    }
}

export const themes = {
    light: vars({
        /* Cores principais da marca */
        '--color-primary': '#52276C',
        '--color-primary-content': '#FFFFFF',

        /* Cores secundárias para acentos */
        '--color-secondary': '#E6CCFF',
        '--color-secondary-content': '#E0E0E0',

        /* Cores terciárias */
        '--color-tertiary': '#F0E6F7',
        '--color-tertiary-content': '#000000',

        /* Cores de feedback */
        '--color-error': '#C0392B',
        '--color-error-content': '#FFFFFF',
        '--color-success': '#27AE60',
        '--color-success-content': '#FFFFFF',

        /* Fundo e superfícies */
        '--color-background': '#F4F6FB',
        '--color-background-content': '#4A4A4A',
        '--color-surface': '#FFFFFF',
        '--color-surface-content': '#4A4A4A',
    }),
    dark: vars({
        /* Cores principais da marca */
        '--color-primary': '#52276C',
        '--color-primary-content': '#FFFFFF',

        /* Cores secundárias para acentos */
        '--color-secondary': '#2C2C2C',
        '--color-secondary-content': '#FFFFFF',

        /* Cores terciárias */
        '--color-tertiary': '#3A1F4C',
        '--color-tertiary-content': '#FFFFFF',

        /* Cores de feedback */
        '--color-error': '#FF6B6B',
        '--color-error-content': '#000000',
        '--color-success': '#6BFF8E',
        '--color-success-content': '#000000',

        /* Fundo e superfícies */
        '--color-background': '#121212',
        '--color-background-content': '#E0E0E0',
        '--color-surface': '#1E1E1E',
        '--color-surface-content': '#E0E0E0',
    })
}