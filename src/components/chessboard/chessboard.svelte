<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" ></script>
    <link rel="stylesheet" href="./chessboard-1.0.0.min.css"/>
    <script src="./chessboard-1.0.0.min.js" on:load={initBoard}> </script>
</svelte:head>

<script>
	import { onMount, onDestroy } from 'svelte';
    import { curr_fen } from '../../state';

	var board;
	let copy_fen;
    let fen = 'start';
    let initial_pos = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
	
    onMount(() => {
        console.log('Mounted');
        console.log('Curr_fen', curr_fen);
        copyFenField();
    });

    // Gets called by "./chessboard-1.0.0.min.js" after onMount()
	function initBoard() {
        console.log('In init Board');
		board = Chessboard('board', {
			draggable: true,
            position: 'start',
            onDrop: onDrop,
            onChange: onChange,
            sparePieces: true,
            dropOffBoard: 'snapback', 
        });
        console.log('Board', board);
        //console.log('Vars', unsubscribeFen, curr_fen, 'Fen', fen);
        copy_fen = board.fen();
        copyFenField()
	}

	function onDrop (source, target, piece, newPos, oldPos, orientation) {
        if (Chessboard.objToFen(oldPos) == Chessboard.objToFen(newPos)) {
            return false;
        }
        console.log('Source: ' + source);
        console.log('Target: ' + target);
        console.log('Piece: ' + piece);
        console.log('New position: ' + Chessboard.objToFen(newPos));
        console.log('Old position: ' + Chessboard.objToFen(oldPos));
        console.log('Orientation: ' + orientation);
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //board.flip(); // Flip of board after move (Make Button)
	}

    function onChange(oldPos, newPos) {
        console.log('On Change', Chessboard.objToFen(newPos));
        copy_fen = Chessboard.objToFen(newPos);
        copyFenField();
    }
	
    const unsubscribeFen = curr_fen.subscribe(new_fen => {
        fen = new_fen;
    })
    onDestroy(unsubscribeFen);  // prevent memory leak

    function copyFenField() {
        var copy_fen_input = document.querySelector("#copy-fen");
        if (copy_fen == undefined) {
            copy_fen_input.value = initial_pos;    
        }
        else {
            copy_fen_input.value = copy_fen;
        }
        //console.log('In Copy Fen', copy_fen);
    }

    function copyFen() {
        var copy_fen_input = document.querySelector("#copy-fen");

         /* Select the text field */
        copy_fen_input.select();
        copy_fen_input.setSelectionRange(0, 99999); /* For mobile devices */

        /* Copy the text inside the text field */
        navigator.clipboard.writeText(copy_fen_input.value);

        /* Alert the copied text */
        //alert("Copied the text: " + copy_fen_input.value);

        //console.log('In copyFen()');
    }

    function getBoardPos() {
        console.log('In getBoardPos()');
        var get_fen_input = document.querySelector("#get-fen");
        let get_pos = get_fen_input.value;
        if (get_pos == "") {
            board.clear(true);
        }
        board.position(get_pos, true);
        get_fen_input.value = "";
    }

</script>



<div class="container">
    {#if board==undefined}
        <div style="width: 400px; height:400px">
            Reload the page... 
        </div>
    {/if}
    <div id='board' style="width: 400px"></div>
    <div class="btn-div">
        <button id="startBtn" on:click={initBoard}>Start Position</button>
        <button id="clearBtn" on:click={board.clear}>Clear Board</button>
    </div>
    <div id="fen-copy-div">
        <input type="text" value="" id="copy-fen">
        <!-- The button used to copy the text -->
        <button on:click={copyFen}>Copy</button>
    </div>
    <div id="fen-get-div">
        <input type="text" value="" id="get-fen">
        <!-- The button used to copy the text -->
        <button id="get-fen-btn" on:click={getBoardPos}>Get Position</button>
    </div>
</div>


<style>
    .container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 500px;
        height: 800px;
        background-color: yellow;
    }
    .btn-div {
        flex: 0;
        display: flex;
        flex-direction: row;
    }
    #startBtn, #clearBtn {
        float: left;
        width: 100%;
        height: 75%;
        background-color: rgb(88, 88, 112);
        color: rgb(255, 255, 255);
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 10px;

    }
    #fen-copy-div {
        display: flex;
        flex: 0;
        width: 450px;
    }
    #copy-fen {
        width: 100%;
        margin-right: 10px;
    }
    #fen-get-div {
        display: flex;
        flex: 0;
        width: 450px;
    }
    #get-fen {
        width: 100%;
        margin-right: 10px;
    }
    #get-fen-btn {
        width: 30%;
    }
</style>