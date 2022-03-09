<script>
	import { gameDataStore } from './state';

	import Chessboard from './components/chessboard/chessboard.svelte';
	import Header from './components/header/header.svelte';
    import CurrentViz from './components/currentViz/current_viz.svelte';
    import FutureViz from './components/futureViz/future_viz.svelte';

	//const jsonFilename = 'games_2022_10k_filt10.json'; // TODO trim and import larger files
	const jsonFilename = 'games_2022_2M_filt10.json'
	let fetchJson = fetch(jsonFilename)
		.then(res => res.json())
		.then(data => {gameDataStore.set(data)});
</script>

<svelte:head>
	<title>Chess Viz</title>
	<link rel="icon" type="image/svg" href={'./img/chesspieces/wikipedia/wQ.png'} />
	<html lang="en" />
</svelte:head>

<main>
	<Header />

	{#await fetchJson}
		<p>Loading...</p>
	{:then result} 
		<div class='viz-container'>
			<CurrentViz />
			<Chessboard />
			<FutureViz />
		</div>
	{:catch error}
		<p style="color: red">While loading an error occurred: {error}</p>
	{/await}

    <p>Build with Svelte. Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
    .viz-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
		background-color: lightgray;
    }
</style>