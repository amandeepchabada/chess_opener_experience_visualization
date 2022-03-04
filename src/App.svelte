<script>
	import Chessboard from './components/chessboard/chessboard.svelte';
	import Header from './components/header/header.svelte';
    import CurrentViz from './components/currentViz/current_viz.svelte';
    import FutureViz from './components/futureViz/future_viz.svelte';

	export let name;

</script>

<main>
	<Header />
	<h1>Hello {name}!</h1>
    <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

    <div class='viz-container'>
        <CurrentViz />
        <Chessboard />
        <FutureViz />
    </div>
</main>

<style>
    .viz-container {
        width: 100%;
        display: flex;
        flex-direction: row;
    }

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>