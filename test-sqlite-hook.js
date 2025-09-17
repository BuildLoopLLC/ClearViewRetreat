// Simple test to check if the SQLite hook is working
import { useWebsiteContent } from './hooks/useWebsiteContentSQLite.js'

console.log('Testing SQLite hook...')

// Test the API directly
fetch('http://localhost:3000/api/sqlite-content?section=hero')
  .then(response => response.json())
  .then(data => {
    console.log('API Response:', data.length, 'items')
    console.log('First item:', data[0])
  })
  .catch(error => {
    console.error('API Error:', error)
  })
