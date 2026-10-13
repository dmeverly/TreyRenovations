
const CONTACT = {
    email: "treypyne1@gmail.com",
    facebook: "",
    linkedin: ""
};

// A category with no projects yet is left out of the filter bar until one is added.
const CATEGORIES = [
    {id: "painting", label: "Painting"},
    {id: "flooring", label: "Flooring"},
    {id: "furniture", label: "Furniture Refinishing"},
    {id: "organization", label: "Organization"},
    {id: "remodel", label: "Room Remodels"},
    {id: "outdoor", label: "Yard & Outdoor"}
];

// Photos live in assets/img/projects/<slug>/ as before-1.jpg, after-1.jpg, ...
// plus cover-before.jpg and cover-after.jpg for the gallery card.
// `before` and `after` are the number of photos of each kind.
// `slider` (optional) names the one before and after photo taken from nearly the same spot, as
// [before number, after number]. A project with a slider is featured near the top of the page with
// a drag-to-compare slider; every other project goes in the gallery below.
const PROJECTS = [
    {
        slug: "garage-stairs",
        title: "Garage Stairs",
        categories: ["painting"],
        before: 2,
        after: 2,
        slider: [1, 2]
    },
    {
        slug: "basement-stairs",
        title: "Basement Stairs",
        categories: ["painting"],
        before: 2,
        after: 3,
        slider: [2, 1]
    },
    {
        slug: "sideboard-refinish",
        title: "Sideboard Refinish",
        categories: ["furniture"],
        before: 1,
        after: 1
    },
    {
        slug: "cabinet-refinish",
        title: "Cabinet Refinish",
        categories: ["furniture"],
        before: 1,
        after: 2
    },
    {
        slug: "armoire-refinish",
        title: "Armoire Refinish",
        categories: ["furniture"],
        before: 1,
        after: 1
    },
    {
        slug: "room-remodel",
        title: "Room Remodel",
        categories: ["remodel", "flooring", "painting"],
        before: 2,
        after: 2
    },
    {
        slug: "pantry-remodel",
        title: "Pantry Remodel",
        categories: ["remodel", "organization", "flooring", "painting"],
        before: 1,
        after: 2
    },
    {
        slug: "bedroom-remodel",
        title: "Bedroom Remodel",
        categories: ["remodel", "flooring", "painting"],
        before: 2,
        after: 2,
        slider: [2, 1]
    },
    {
        slug: "kitchenette-renovation",
        title: "Kitchenette Renovation",
        categories: ["remodel", "flooring", "painting"],
        before: 1,
        after: 1
    },
    {
        slug: "black-accent-wall",
        title: "Black Accent Wall",
        categories: ["painting"],
        before: 1,
        after: 1
    },
    {
        slug: "attic-accent-wall",
        title: "Attic Accent Wall",
        categories: ["painting"],
        before: 1,
        after: 1
    },
    {
        slug: "headboard-refinish",
        title: "Headboard Refinish",
        categories: ["furniture"],
        before: 1,
        after: 1
    },
    {
        slug: "dining-table-refinish",
        title: "Dining Table Refinish",
        categories: ["furniture"],
        before: 1,
        after: 1
    },
    {
        slug: "garage-makeover",
        title: "Garage Makeover",
        categories: ["organization", "flooring", "painting"],
        before: 1,
        after: 2,
        slider: [1, 1]
    },
    {
        slug: "bedroom-refresh",
        title: "Bedroom Refresh",
        categories: ["painting"],
        before: 1,
        after: 1
    },
    {
        slug: "accent-wall-dresser",
        title: "Accent Wall & Dresser",
        categories: ["painting", "furniture"],
        before: 1,
        after: 2
    },
    {
        slug: "round-table-refinish",
        title: "Round Table Refinish",
        categories: ["furniture"],
        before: 1,
        after: 2
    }
];
