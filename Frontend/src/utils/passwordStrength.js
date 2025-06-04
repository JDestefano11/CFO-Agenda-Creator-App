/**
 * Utility functions for password strength calculation
 */

// Calculate password strength (0-5)
export const calculatePasswordStrength = (password) => {
    if (!password) return 0;

    // Check password requirements
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };

    // Calculate strength (0-5)
    let strength = 0;
    if (requirements.length) strength++;
    if (requirements.uppercase) strength++;
    if (requirements.lowercase) strength++;
    if (requirements.number) strength++;
    if (requirements.special) strength++;

    return {
        strength,
        requirements
    };
};

// Get strength class for styling text
export const getStrengthClass = (strength) => {
    if (strength < 2) return 'text-red-500';
    if (strength < 4) return 'text-yellow-500';
    return 'text-green-500';
};

// Get strength class for the bar
export const getStrengthBarClass = (strength) => {
    if (strength < 2) return 'bg-red-500';
    if (strength < 4) return 'bg-yellow-500';
    return 'bg-green-500';
};

// Get strength text
export const getStrengthText = (strength) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Fair';
    return 'Strong';
};