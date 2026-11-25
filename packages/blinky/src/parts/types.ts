export interface FaceParts {
	body: string;
	/** Mouth, cheeks, beak: breathe with the face, never blink. */
	features: string;
	/** Blinks and takes the state's eye shape. */
	eyes: string;
	/** Shut eyes, shown instead of `eyes` while the avatar sleeps (away or offline). */
	closed: string;
	/** Drawn above the eyes (the bold look's nose). */
	over?: string;
}

export interface FaceOptions {
	/** Pseudo-3D finish for soft, bold and blob: body shading and eye gloss. Still a flat SVG. */
	depth?: boolean;
}
