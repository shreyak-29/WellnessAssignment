// Background pattern styles
export const BACKGROUND_PATTERNS = {
  // Checkered pattern with purple theme
  checkered: (isDark = false) => ({
    backgroundImage: `
      linear-gradient(45deg, ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)'} 25%, transparent 25%),
      linear-gradient(-45deg, ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)'} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)'} 75%),
      linear-gradient(-45deg, transparent 75%, ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)'} 75%)
    `,
    backgroundSize: '30px 30px',
    backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px'
  }),

  // Alternative patterns
  dots: (isDark = false) => ({
    backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)'} 1px, transparent 1px)`,
    backgroundSize: '20px 20px'
  }),

  stripes: (isDark = false) => ({
    backgroundImage: `linear-gradient(45deg, ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)'} 25%, transparent 25%, transparent 75%, ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)'} 75%)`,
    backgroundSize: '40px 40px'
  })
};

// Common style constants
export const COMMON_STYLES = {
  // Gradient backgrounds
  purpleGradient: 'bg-gradient-to-br from-purple-50 to-pink-100',
  blueGradient: 'bg-gradient-to-br from-blue-50 to-indigo-100',
  greenGradient: 'bg-gradient-to-br from-green-50 to-emerald-100',
  
  // Card styles
  card: 'bg-white rounded-2xl shadow-xl p-8',
  cardHover: 'bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300',
  
  // Button styles
  primaryButton: 'bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium',
  secondaryButton: 'bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors',
  dangerButton: 'bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors'
}; 