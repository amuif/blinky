export interface SoftPalette {
	body: string;
	shadow: string;
	cheek: string;
}

export interface BoldPalette {
	body: string;
	nose: string;
}

// v1 colours. Append only; never reorder (see seed/traits.ts).
export const SOFT_PALETTES: readonly SoftPalette[] = [
	{ body: "#ffc9d6", shadow: "#f4a7ba", cheek: "#ff8fab" }, // pink
	{ body: "#ffd8b8", shadow: "#f6bb8f", cheek: "#ff9f6e" }, // peach
	{ body: "#ffeaa0", shadow: "#f2d470", cheek: "#ffb36b" }, // butter
	{ body: "#d9f2b0", shadow: "#b9df86", cheek: "#ff9e9e" }, // pistachio
	{ body: "#b8ecd4", shadow: "#8fd9b8", cheek: "#ff9fb2" }, // mint
	{ body: "#b5eaea", shadow: "#8bd6d6", cheek: "#ff9fb2" }, // aqua
	{ body: "#bfdcff", shadow: "#97c2f5", cheek: "#ff9fc0" }, // sky
	{ body: "#c9cbff", shadow: "#a6a9f5", cheek: "#ff9fc8" }, // periwinkle
	{ body: "#dcc8ff", shadow: "#c2a6f5", cheek: "#ff9fc8" }, // lavender
	{ body: "#f3c4f0", shadow: "#e2a0dd", cheek: "#ff8fbf" }, // orchid
	{ body: "#e8dccb", shadow: "#d4c3aa", cheek: "#ff9f9f" }, // oat
	{ body: "#d4e4e8", shadow: "#b4cbd1", cheek: "#ffa3b5" }, // fog
];

// Bold and flat so the white eyes pop.
export const BOLD_PALETTES: readonly BoldPalette[] = [
	{ body: "#ff5a5f", nose: "#ffd43b" }, // coral
	{ body: "#ff8c42", nose: "#ffe066" }, // tangerine
	{ body: "#ffc93c", nose: "#ff6b6b" }, // sunflower
	{ body: "#8ac926", nose: "#ffd43b" }, // lime
	{ body: "#2ec4b6", nose: "#ffd43b" }, // mint
	{ body: "#4cc9f0", nose: "#ffd43b" }, // sky
	{ body: "#4361ee", nose: "#ffd43b" }, // blue
	{ body: "#7b5cff", nose: "#ffd43b" }, // violet
	{ body: "#c45bd8", nose: "#ffd43b" }, // orchid
	{ body: "#ff70a6", nose: "#ffd43b" }, // pink
	{ body: "#c08552", nose: "#ffd43b" }, // mocha
	{ body: "#6c8ead", nose: "#ffd43b" }, // slate
];

/** Milky pastels for mochi buns. */
export const MOCHI_COLORS: readonly string[] = [
	"#f7f0e8", // rice
	"#f5e3e6", // sakura
	"#e8efe1", // matcha milk
	"#e4ecf3", // sky milk
	"#efe7f4", // taro
	"#f8ecd9", // kinako
	"#fbe6dc", // peach
	"#e6f1ee", // mint
	"#f3efd9", // yuzu
	"#ece4dc", // hojicha
	"#e9e7f6", // lavender
	"#f6e4ec", // strawberry milk
];

/** Downy chick colours. */
export const CHICK_COLORS: readonly string[] = [
	"#ffe58a", // yolk
	"#fff1c2", // cream
	"#ffd6b0", // apricot
	"#e9e4dc", // duckling grey
	"#ffeaa0", // lemon
	"#f6dccb", // sand
	"#e3edf7", // snow
	"#f7e0ea", // blossom
];

/** Gummy flavours: light top and saturated bottom of the gradient. */
export const JELLY_FLAVORS: readonly (readonly [string, string])[] = [
	["#ffd1dc", "#ff7f9e"], // strawberry
	["#d8f5b8", "#86cf5b"], // lime
	["#e5d4ff", "#a07ee8"], // grape
	["#ffe2b8", "#ffa64d"], // orange
	["#fff3b0", "#f5cf3b"], // lemon
	["#c9efff", "#5fbfe8"], // soda
	["#ffd6c9", "#ff8a6b"], // peach
	["#d4f5ec", "#4fc7a6"], // melon
];
