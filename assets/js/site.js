
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PROJECT_IMG_ROOT = "assets/img/projects";

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
}

function categoryLabel(id) {
    const match = CATEGORIES.find((c) => c.id === id);
    return match ? match.label : id;
}

function photoCount(p, stage) {
    return Number.isInteger(p[stage]) && p[stage] > 0 ? p[stage] : 0;
}

function photoSrc(p, stage, i) {
    return `${PROJECT_IMG_ROOT}/${p.slug}/${stage}-${i}.jpg`;
}

function projectPhotos(p) {
    const photos = [];
    for (const stage of ["before", "after"]) {
        const count = photoCount(p, stage);
        for (let i = 1; i <= count; i++) {
            photos.push({
                stage,
                src: photoSrc(p, stage, i),
                alt: `${p.title}, ${stage}${count > 1 ? ` (photo ${i} of ${count})` : ""}`
            });
        }
    }
    return photos;
}

function photoTotal(p) {
    return photoCount(p, "before") + photoCount(p, "after");
}

function isFeatured(p) {
    return Array.isArray(p.slider) && p.slider.length === 2;
}

function stageLabel(stage) {
    return el("span", `stage-label stage-label--${stage}`, stage === "before" ? "Before" : "After");
}

/* ===== Before / after slider ===== */

function setupCompare(root) {
    const range = root.querySelector(".compare__range");
    const sync = () => root.style.setProperty("--pos", `${range.value}%`);
    range.addEventListener("input", sync);
    sync();
}

function buildCompare(p) {
    const root = el("div", "compare");
    const imgs = ["before", "after"].map((stage, i) => {
        const img = el("img", `compare__img${stage === "after" ? " compare__img--after" : ""}`);
        img.src = photoSrc(p, stage, p.slider[i]);
        img.alt = `${p.title}, ${stage}`;
        img.loading = "lazy";
        img.decoding = "async";
        return img;
    });

    const divider = el("span", "compare__divider");
    divider.setAttribute("aria-hidden", "true");
    divider.appendChild(el("span", "compare__knob", "‹›"));

    const range = el("input", "compare__range");
    range.type = "range";
    range.min = "0";
    range.max = "100";
    range.step = "1";
    range.value = "50";
    range.setAttribute("aria-label", `${p.title}: slide to compare before and after`);

    root.append(...imgs, stageLabel("before"), stageLabel("after"), divider, range);
    setupCompare(root);
    return {root, imgs};
}

function buildMoreButton(p, onOpen) {
    const more = el("button", "link-btn", `All ${photoTotal(p)} photos`);
    more.type = "button";
    more.setAttribute("aria-label", `${p.title}: view all ${photoTotal(p)} photos`);
    more.addEventListener("click", () => onOpen(p, more));
    return more;
}

function buildFeature(p, onOpen) {
    const figure = el("figure", "feature reveal");
    const {root, imgs} = buildCompare(p);

    // The two photos are rarely the exact same shape, so the frame takes the ratio halfway between them.
    const fit = () => {
        if (!imgs.every((img) => img.naturalWidth)) return;
        const [rb, ra] = imgs.map((img) => img.naturalWidth / img.naturalHeight);
        figure.style.setProperty("--ratio", Math.sqrt(rb * ra).toFixed(4));
    };
    imgs.forEach((img) => img.addEventListener("load", fit));
    fit();

    const caption = el("figcaption", "feature__caption");
    caption.appendChild(el("span", "feature__title", p.title));
    caption.appendChild(buildMoreButton(p, onOpen));

    figure.append(root, caption);
    return figure;
}

/* ===== Gallery ===== */

function buildCoverHalf(p, stage) {
    const half = el("span", "project-card__half");
    const img = el("img", "project-card__img");
    img.src = `${PROJECT_IMG_ROOT}/${p.slug}/cover-${stage}.jpg`;
    img.alt = `${p.title}, ${stage}`;
    img.loading = "lazy";
    img.decoding = "async";
    half.append(img, stageLabel(stage));
    return half;
}

function buildProjectCard(p, onOpen) {
    const card = el("button", "project-card reveal");
    card.type = "button";
    card.dataset.categories = (p.categories || []).join(" ");

    const cover = el("span", "project-card__cover");
    cover.append(buildCoverHalf(p, "before"), buildCoverHalf(p, "after"));

    const body = el("span", "project-card__body");
    body.appendChild(el("span", "project-card__title", p.title));
    body.appendChild(el("span", "project-card__count", `${photoTotal(p)} photos`));

    const tags = el("span", "project-card__tags", (p.categories || []).map(categoryLabel).join(" · "));

    card.append(cover, body, tags);
    card.addEventListener("click", () => onOpen(p, card));
    return card;
}

function usedCategories(projects) {
    return CATEGORIES
        .map((c) => ({...c, count: projects.filter((p) => (p.categories || []).includes(c.id)).length}))
        .filter((c) => c.count > 0);
}

function renderFilters(root, grid, projects) {
    const options = [{id: "all", label: "All", count: projects.length}, ...usedCategories(projects)];
    const buttons = options.map((opt) => {
        const btn = el("button", "filter-btn");
        btn.type = "button";
        btn.append(el("span", "", opt.label), el("span", "filter-btn__count", opt.count));
        btn.setAttribute("aria-pressed", String(opt.id === "all"));
        btn.addEventListener("click", () => {
            buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
            for (const card of grid.children) {
                const cats = card.dataset.categories.split(" ");
                card.hidden = opt.id !== "all" && !cats.includes(opt.id);
            }
        });
        return btn;
    });
    root.replaceChildren(...buttons);
}

/* ===== Photo viewer ===== */

function setupLightbox() {
    const dialog = document.getElementById("lightbox");
    const track = document.getElementById("lightbox-track");
    const title = document.getElementById("lightbox-title");
    const counter = document.getElementById("lightbox-counter");
    const prev = document.getElementById("lightbox-prev");
    const next = document.getElementById("lightbox-next");
    const close = document.getElementById("lightbox-close");
    let opener = null;

    function current() {
        return Math.round(track.scrollLeft / track.clientWidth) || 0;
    }

    function update() {
        const count = track.children.length;
        const i = Math.min(current(), count - 1);
        counter.textContent = `${i + 1} / ${count}`;
        prev.disabled = i <= 0;
        next.disabled = i >= count - 1;
    }

    function go(delta) {
        const i = Math.max(0, Math.min(track.children.length - 1, current() + delta));
        track.scrollTo({left: i * track.clientWidth, behavior: "smooth"});
    }

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    close.addEventListener("click", () => dialog.close());
    track.addEventListener("scroll", update, {passive: true});
    window.addEventListener("resize", update);

    dialog.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
    });
    // click on the backdrop (outside the panel) closes
    dialog.addEventListener("click", (e) => {
        if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
        document.documentElement.classList.remove("no-scroll");
        track.replaceChildren();
        if (opener) opener.focus();
    });

    return function open(p, source) {
        opener = source;
        title.textContent = p.title;
        track.replaceChildren(...projectPhotos(p).map((photo) => {
            const slide = el("figure", "lightbox__slide");
            const img = el("img", "lightbox__img");
            img.src = photo.src;
            img.alt = photo.alt;
            img.decoding = "async";
            slide.append(img, stageLabel(photo.stage));
            return slide;
        }));
        document.documentElement.classList.add("no-scroll");
        dialog.showModal();
        track.scrollLeft = 0;
        update();
    };
}

/* ===== Contact ===== */

function contactLinks() {
    const web = (v) => /^https:\/\//.test(String(v).trim()) ? String(v).trim() : "";
    const links = [];
    if (CONTACT.email) links.push({label: CONTACT.email, href: `mailto:${CONTACT.email}`});
    if (web(CONTACT.facebook)) links.push({label: "Facebook", href: web(CONTACT.facebook), external: true});
    if (web(CONTACT.linkedin)) links.push({label: "LinkedIn", href: web(CONTACT.linkedin), external: true});
    return links;
}

function renderContact(root) {
    root.replaceChildren(...contactLinks().map((l, i) => {
        const a = el("a", `btn contact__link${i === 0 ? " contact__link--primary" : ""}`, l.label);
        a.href = l.href;
        if (l.external) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
        }
        return a;
    }));
}


document.addEventListener("DOMContentLoaded", () => {
    const openLightbox = setupLightbox();
    const projects = PROJECTS.filter((p) => SLUG_RE.test(p.slug));

    // The intro slider is written into the page; the rest of the slider projects fill the featured row.
    const intro = document.getElementById("intro-compare");
    setupCompare(intro);
    const introProject = projects.find((p) => p.slug === intro.dataset.project);
    if (introProject) document.getElementById("intro-more").replaceChildren(buildMoreButton(introProject, openLightbox));

    const featured = projects.filter((p) => isFeatured(p) && p !== introProject);
    document.getElementById("featured-row").replaceChildren(...featured.map((p) => buildFeature(p, openLightbox)));
    document.getElementById("featured").hidden = featured.length === 0;

    const rest = projects.filter((p) => !isFeatured(p));
    const grid = document.getElementById("projects-grid");
    grid.replaceChildren(...rest.map((p) => buildProjectCard(p, openLightbox)));
    renderFilters(document.getElementById("project-filters"), grid, rest);

    renderContact(document.getElementById("contact-links"));
    document.getElementById("intro-services").replaceChildren(
        ...usedCategories(projects).map((c) => el("li", "", c.label))
    );

    const items = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (e.isIntersecting) {
                e.target.classList.add("in-view");
                obs.unobserve(e.target);
            }
        }
    }, {threshold: 0.12});

    items.forEach(el => obs.observe(el));
});
