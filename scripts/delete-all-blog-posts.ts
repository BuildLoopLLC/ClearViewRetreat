/**
 * Delete all posts from the local blog_posts table.
 * Use for resetting the blog before re-import (e.g. WordPress + podcast RSS).
 */

import { getDatabase, closeDatabase } from '../lib/sqlite'

const db = getDatabase()
const result = db.prepare('DELETE FROM blog_posts').run()
closeDatabase()
console.log(`Deleted ${result.changes} blog post(s).`)
