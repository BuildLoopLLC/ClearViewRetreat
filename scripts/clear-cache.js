// Clear browser cache for statistics
console.log('🗑️ Clearing cache...')

// Clear localStorage cache
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('clearview_content_cache')
  console.log('✅ Cleared localStorage cache')
}

// Clear session storage
if (typeof sessionStorage !== 'undefined') {
  sessionStorage.clear()
  console.log('✅ Cleared sessionStorage')
}

// Force reload
if (typeof window !== 'undefined') {
  window.location.reload()
  console.log('🔄 Reloading page...')
} else {
  console.log('Run this in browser console to clear cache')
}
