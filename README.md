# Portfolio

Personal portfolio site for Zaryan Syed, a Computer Engineering (Co-op) student at the University of Guelph.

Built with plain **HTML**, **CSS**, and **JavaScript**, with no frameworks and no build step.

---

## Project Structure

```text
portfolio/
│
├── index.html        Page structure and content
├── style.css         All styling, including the light and dark themes
├── script.js         Navigation, image lightbox, and project deep dives
│
├── assets/
│   ├── images/       Project images and logos
│   └── resume/       Resume PDF
│
└── README.md
```

---

## Making Changes

Because images and styles live in their own files, most edits do not touch the HTML.

- **Change an image:** replace the file in `assets/images/` with one of the same name
- **Update the resume:** replace `assets/resume/Zaryan_Syed_Resume.pdf`
- **Change colors:** edit the variables at the top of `style.css`
- **Edit a project's deep dive:** edit its entry in the `deepDives` object in `script.js`

### Adding a Project

1. Add the image to `assets/images/`
2. Copy an existing `project-card` block in the Featured section of `index.html` and update the text, image path, and links
3. Copy an existing `project-entry` block in the All projects section
4. Add a matching entry to `deepDives` in `script.js`, using the same key as the `data-deepdive` attribute on the button

---

## Running Locally

The site can be opened directly by double-clicking `index.html`, or served locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.
