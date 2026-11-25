<script lang="ts">
import {
	ScrollArea,
	ScrollAreaContent,
	ScrollAreaScrollbar,
	ScrollAreaThumb,
	ScrollAreaViewport,
} from "@ui-sdk/svelte/scroll-area";

type Status = "online" | "away" | "offline";
interface Person {
	name: string;
	status: Status;
}

const cap = (s: string) => s[0]?.toUpperCase() + s.slice(1);
const first = (name: string) => name.split(" ")[0] ?? name;

const here = ["Noah Kim", "Priya Nair", "Omar Haddad", "Elif Yılmaz"];
const comments = [
	{ who: "Lena Fischer", text: "The onboarding screens are up for review." },
	{ who: "Arjun Mehta", text: "Lovely. One note on the card spacing." },
];
const team: Person[] = [
	{ name: "Sofia Martínez", status: "online" },
	{ name: "Kenji Tanaka", status: "away" },
	{ name: "Amara Okafor", status: "offline" },
];
const activity: (Person & { text: string; time: string })[] = [
	{
		name: "Mateo García",
		status: "online",
		text: "merged the billing fix",
		time: "2m",
	},
	{
		name: "Aiko Suzuki",
		status: "away",
		text: "commented on the Q3 plan",
		time: "14m",
	},
	{
		name: "Chinedu Eze",
		status: "offline",
		text: "uploaded three designs",
		time: "1h",
	},
	{
		name: "Ingrid Larsen",
		status: "online",
		text: "opened a support ticket",
		time: "3h",
	},
];
const users: (Person & { email: string; role: string })[] = [
	{
		name: "Mateo García",
		email: "mateo@example.com",
		role: "Admin",
		status: "online",
	},
	{
		name: "Fatima Zahra",
		email: "fatima@example.com",
		role: "Editor",
		status: "away",
	},
	{
		name: "Wei Chen",
		email: "wei@example.com",
		role: "Viewer",
		status: "offline",
	},
	{
		name: "Lucas Moreau",
		email: "lucas@example.com",
		role: "Editor",
		status: "online",
	},
	{
		name: "Ananya Rao",
		email: "ananya@example.com",
		role: "Admin",
		status: "online",
	},
];
</script>

<section id="context" class="wrap block">
	<div class="head">
		<p class="kicker">Examples</p>
		<h2>Drop it anywhere a person shows up</h2>
	</div>
	<div class="examples">
		<div class="card ex">
			<span class="ex-title">Who's here</span>
			<div class="stack" aria-hidden="true">
				{#each here as n (n)}<blinky-avatar seed={n} size="36"></blinky-avatar>{/each}
				<span class="more-bubble">+3</span>
			</div>
			<p class="muted small">Avatar stacks on docs, boards and dashboards.</p>
		</div>

		<div class="card ex">
			<span class="ex-title">Comments</span>
			{#each comments as { who, text } (who)}
				<div class="comment">
					<span aria-hidden="true"><blinky-avatar seed={who} look="chick" size="28"></blinky-avatar></span>
					<div><b>{first(who)}</b><span class="muted">{text}</span></div>
				</div>
			{/each}
		</div>

		<div class="card ex">
			<span class="ex-title">Team list</span>
			{#each team as m (m.name)}
				<div class="member">
					<blinky-avatar seed={m.name} name={first(m.name)} look="mochi" status={m.status} size="28"></blinky-avatar>
					<span class="who" class:muted={m.status === "offline"}>{m.name}</span>
					<span class="presence {m.status}">{cap(m.status)}</span>
				</div>
			{/each}
		</div>

		<div class="card ex wide">
			<span class="ex-title">Dashboard</span>
			<div class="mock">
				<div class="mock-bar">
					<b>Overview</b>
					<blinky-avatar seed="Mateo García" name="Mateo" status="online" size="28"></blinky-avatar>
				</div>
				<p class="mock-label">Recent activity</p>
				{#each activity as a (a.name)}
					<div class="activity">
						<blinky-avatar seed={a.name} name={first(a.name)} status={a.status} size="32"></blinky-avatar>
						<span class="activity-text"><b>{first(a.name)}</b> {a.text}</span>
						<span class="muted small">{a.time}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="card ex wide">
			<span class="ex-title">Profile page</span>
			<div class="mock profile">
				<div class="banner" aria-hidden="true"></div>
				<div class="profile-face">
					<blinky-avatar seed="Amara Okafor" name="Amara" look="bold" status="online" size="80"></blinky-avatar>
				</div>
				<h3>Amara Okafor</h3>
				<p class="muted small">@amara · Product designer</p>
				<span class="presence online">Online</span>
				<p class="small">Designs onboarding and the settings pages. Happy to talk empty states.</p>
			</div>
		</div>

		<div class="card ex full">
			<span class="ex-title">User list</span>
			<ScrollArea class="scroller">
				<ScrollAreaViewport role="region" aria-label="User list">
					<ScrollAreaContent>
						<table class="users">
							<thead>
								<tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Role</th><th scope="col">Status</th></tr>
							</thead>
							<tbody>
								{#each users as u (u.email)}
									<tr>
										<td>
											<span class="user-cell">
												<blinky-avatar seed={u.name} name={first(u.name)} status={u.status} size="32"></blinky-avatar>
												{u.name}
											</span>
										</td>
										<td class="muted">{u.email}</td>
										<td>{u.role}</td>
										<td><span class="presence {u.status}">{cap(u.status)}</span></td>
									</tr>
								{/each}
							</tbody>
						</table>
					</ScrollAreaContent>
				</ScrollAreaViewport>
				<ScrollAreaScrollbar orientation="horizontal"><ScrollAreaThumb /></ScrollAreaScrollbar>
			</ScrollArea>
		</div>
	</div>
</section>
