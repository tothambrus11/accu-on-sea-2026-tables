<script lang="ts">
	import { searchNames, peopleAtTable, tableCount, peopleCount } from '$lib/search';

	let query = $state('');
	let results = $derived(searchNames(query));
	let searched = $derived(query.trim().length > 0);

	/** The person/table the user clicked to see seatmates for. */
	let selected = $state<{ name: string; table: string } | null>(null);

	let tablemates = $derived(
		selected ? peopleAtTable(selected.table).filter((n) => n !== selected!.name) : []
	);

	function select(name: string, table: string) {
		selected = { name, table };
	}

	function back() {
		selected = null;
	}
</script>

<svelte:head>
	<title>Find your table</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 px-4 py-10 sm:py-16">
	<main class="mx-auto w-full max-w-xl">
		<header class="mb-8 text-center">
			<h1
				class="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl"
			>
				Find your table
			</h1>
			<p class="mt-2 text-sm text-slate-500">
				{peopleCount} guests &middot; {tableCount} tables
			</p>
		</header>

		{#if selected}
			<!-- Table detail view -->
			<section
				class="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur"
			>
				<button
					onclick={back}
					class="mb-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
				>
					<span aria-hidden="true">&larr;</span> Back to search
				</button>

				<div class="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
					{selected.table}
				</div>
				<h2 class="mb-5 text-2xl font-bold text-slate-900">{selected.name}</h2>

				{#if tablemates.length > 0}
					<p class="mb-3 text-sm text-slate-500">
						Sitting with {tablemates.length}
						{tablemates.length === 1 ? 'other person' : 'other people'}:
					</p>
					<ul class="space-y-2">
						{#each tablemates as mate (mate)}
							<li
								class="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 font-medium text-slate-700"
							>
								{mate}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-sm text-slate-500">No one else is seated at this table.</p>
				{/if}
			</section>
		{:else}
			<!-- Search view -->
			<div class="relative">
				<svg
					class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
				<input
					type="search"
					bind:value={query}
					placeholder="Type part of a name…"
					autocomplete="off"
					class="w-full rounded-2xl border border-slate-200 bg-white/80 py-4 pl-12 pr-4 text-lg text-slate-900 shadow-sm outline-none backdrop-blur transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
				/>
			</div>

			{#if searched}
				{#if results.length > 0}
					<p class="mt-4 px-1 text-sm text-slate-500">
						{results.length} match{results.length === 1 ? '' : 'es'} &middot; tap a name to see their table
					</p>
					<ul class="mt-2 space-y-2">
						{#each results as { name, table } (name + table)}
							<li>
								<button
									onclick={() => select(name, table)}
									class="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white/80 px-5 py-4 text-left shadow-sm backdrop-blur transition hover:border-indigo-200 hover:shadow-md"
								>
									<span class="font-semibold text-slate-800 group-hover:text-indigo-700">
										{name}
									</span>
									<span
										class="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 group-hover:bg-indigo-100"
									>
										{table}
									</span>
								</button>
							</li>
						{/each}
					</ul>
				{:else}
					<div
						class="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-10 text-center text-slate-500"
					>
						No one matches &ldquo;{query.trim()}&rdquo;.
					</div>
				{/if}
			{/if}
		{/if}
	</main>
</div>
