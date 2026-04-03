import { ref, watch } from 'vue'

const darkMode = ref(localStorage.getItem('darkMode') === 'true')

function applyTheme(val) {
  document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light')
}

// Apply on first load
applyTheme(darkMode.value)

watch(darkMode, (val) => {
  applyTheme(val)
  localStorage.setItem('darkMode', val)
})

export function useDarkMode() {
  return { darkMode }
}
