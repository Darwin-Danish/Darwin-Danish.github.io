/* global CMS */
;(function () {
  if (typeof window === 'undefined') return
  // Decap CMS loads CMS on window; this script runs after decap-cms.js
  if (!window.CMS) return

  // Apply preview styles (kept in /public so it's stable in production).
  window.CMS.registerPreviewStyle('/admin/preview.css')

  // KaTeX is used on the site; include it so math previews don't look broken.
  window.CMS.registerPreviewStyle(
    'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css',
  )
})()

