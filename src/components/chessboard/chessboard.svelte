<script>
	import { onMount, onDestroy } from 'svelte';
    import { curr_fen } from '../../state';

	let board;
	let el;
    let fen = 'start';
	
	function onDrop (source, target, piece, newPos, oldPos, orientation) {
        console.log('Source: ' + source)
        console.log('Target: ' + target)
        console.log('Piece: ' + piece)
        console.log('New position: ' + Chessboard.objToFen(newPos))
        console.log('Old position: ' + Chessboard.objToFen(oldPos))
        console.log('Orientation: ' + orientation)
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
	}
	
	function initBoard() {
		board = Chessboard(el, {
			draggable: true,
            position: fen || 'start',
            onDrop: onDrop,
            sparePieces: true
        });
	}
	
	onMount(() => {
        console.log('Mounted');
    });
	
    const unsubscribeFen = curr_fen.subscribe(new_fen => {
        fen = new_fen;
    })
    onDestroy(unsubscribeFen);  // prevent memory leak
</script>

<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" ></script>
    <link rel="stylesheet" href="./chessboard-1.0.0.min.css"/>
    <script src="./chessboard-1.0.0.min.js" on:load={initBoard}> </script>
</svelte:head>

<div class="container">

    {#if board===undefined}
        <div style="width: 400px; height:400px">
            Loading...
        </div>
        <button id="startBtn">Start Position</button>
        <button id="clearBtn">Clear Board</button>
    {/if}

    <div bind:this={el} style="width: 400px"></div>
    <button id="startBtn">Start Position</button>
    <button id="clearBtn">Clear Board</button>
</div>


<style>
    .container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 500px;
        background-color: yellow;
    }
</style>