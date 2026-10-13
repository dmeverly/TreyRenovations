Trey Renovations Online Portfolio


## Adding a project

1. Create `assets/img/projects/<slug>/` with `before-1.jpg`, `after-1.jpg`, ... (about 1600px on the long edge)
   plus `cover-before.jpg` and `cover-after.jpg` (about 720px) for the gallery card.
2. Add an entry to `PROJECTS` in `assets/js/data.js` with the slug, title, categories, and photo counts.

To feature a project with a drag-to-compare slider, add `slider: [before number, after number]` to its entry,
naming the two photos taken from the same spot. Projects without it appear in the gallery.

Contact links are set in the `CONTACT` object at the top of `assets/js/data.js`.
