// Shared by every look: the eyes shown while an avatar sleeps.

/** Two shut eyes (‿ ‿) of half-width w on the eye line y, at x = 50 ± gap. */
export const shutEyes = (
	gap: number,
	y: number,
	w: number,
	ink: string,
	sw: number,
) =>
	`<g part="eyes-closed"><path d="M${50 - gap - w} ${y}q${w} ${w * 0.8} ${w * 2} 0M${50 + gap - w} ${y}q${w} ${w * 0.8} ${w * 2} 0" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round"/></g>`;
