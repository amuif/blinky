<script>
// Svelte wrapper: <Blinky name="…" /> renders <blinky-avatar> and registers it once.
import "blinky-avatar";

let {
	name,
	seed,
	size,
	status,
	look,
	depth = false,
	animated = true,
	...rest
} = $props();
</script>

<blinky-avatar
	{...rest}
	seed={seed ?? name}
	{name}
	size={size === undefined ? undefined : String(size)}
	{status}
	{look}
	depth={depth ? "" : undefined}
	animated={animated === false ? "false" : undefined}
></blinky-avatar>
