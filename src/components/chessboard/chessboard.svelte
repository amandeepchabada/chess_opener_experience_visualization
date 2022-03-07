<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" ></script>
    <link rel="stylesheet" href="./chessboard-1.0.0.min.css"/>
    <script src="./chessboard-1.0.0.min.js" on:load={initBoard}> </script>
</svelte:head>

<script>
	import { onMount, onDestroy } from 'svelte';
    import { curr_fen } from '../../state';

    import { Chess } from '../../../node_modules/chess.js/chess';

	var board;
	let copy_fen;
    let fen = 'start';
    let initial_pos = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
    var legal = false;

    var game;
    var whiteSquareGrey = '#a9a9a9';
    var blackSquareGrey = '#696969';

    onMount(() => {
        console.log('Mounted');
        console.log('Curr_fen', curr_fen);
        copyFenField();
        playerChance(false);
        //game = new Chess();
        //console.log('Game: ', game);

    });

    // Gets called by "./chessboard-1.0.0.min.js" after onMount()
	function initBoard() {
        //console.log('In init Board');
        game = new Chess();
		board = Chessboard('board', {
			draggable: true,
            position: 'start',
            onDrop: onDrop,
            onChange: onChange,
            onDragStart: onDragStart,
            onMouseoverSquare: onMouseoverSquare,
            onMouseoutSquare: onMouseoutSquare,
            sparePieces: (legal==true)? false: true,
            dropOffBoard: (legal==true)? 'snapback': 'trash', 
        });
        //console.log('Board', board);
        //console.log('Vars', unsubscribeFen, curr_fen, 'Fen', fen);
        copy_fen = board.fen();
        copyFenField();
	}

	function onDrop (source, target, piece, newPos, oldPos, orientation) {
        if (Chessboard.objToFen(oldPos) == Chessboard.objToFen(newPos)) {
            return false;
        }

        removeGreySquares();
        
        //console.log('Source: ' + source);
        //console.log('Target: ' + target);
        //console.log('Piece: ' + piece);
        //console.log('New position: ' + Chessboard.objToFen(newPos));
        //console.log('Old position: ' + Chessboard.objToFen(oldPos));
        //console.log('Orientation: ' + orientation);
        //console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //board.flip(); // Flip of board after move (Make Button)

        var move = game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });
        
        if (legal) {
            console.log('Move: ', move);
            // illegal move
            if (move === null) {return 'snapback';}
        }
        
        
	}

    function onChange(oldPos, newPos) {
        console.log('On Change', Chessboard.objToFen(newPos));
        copy_fen = Chessboard.objToFen(newPos);
        copyFenField();
        console.log('Turn to Play: ', game.turn());
        playerChance(legal);
    }

    function onDragStart (source, piece) {
        console.log('In onDragStart()');
    }

    function onMouseoverSquare (square, piece) {
        // get list of possible moves for this square

        var moves = game.moves({
            square: square,
            verbose: true
        });

        //console.log(square, piece, 'Moves: ', moves);
        // exit if there are no moves available for this square
        //if (moves.length === 0) { return; }

        // highlight the square they moused over
        greySquare(square);

        // highlight the possible squares for this piece
        for (var i = 0; i < moves.length; i++) {
            greySquare(moves[i].to);
        }

    }

    function greySquare (square) {
        var sq = document.querySelector('#board .square-' + square)
        //console.log('Grey Square(): ', sq);
        var sq_class = sq.getAttribute('class');

        var background = whiteSquareGrey;
        if (sq_class.includes('black-3c85d')) {
            //console.log('Grey Square() Class: ', sq_class);
            background = blackSquareGrey;
        }

        //sq.setAttribute('background-color', 'blue');
        //sq.setAttribute('background', 'red');
        //sq.setAttribute('fill', 'red');
        sq.style.background = background;
    }

    function onMouseoutSquare (square, piece) {
        removeGreySquares();
    }

    function removeGreySquares () {
        var rm_sq = document.querySelectorAll('#board .square-55d63');

        for (var i=0;i<rm_sq.length;i++) {
            rm_sq[i].style.background = '';
        }

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

    function checkLegal() {
        var legal_checkbox = document.querySelector('#legal');
        console.log('LegalChechBox: ', legal_checkbox.checked);
        legal = legal_checkbox.checked;
        
        initBoard();
        playerChance(legal);
    }

    function playerChance(flag) {
        //console.log('Here', flag);
        var parEle = document.querySelector('#who-plays');
        var tex_to_add;
        if (flag == false) {
            parEle.innerHTML = '';
            tex_to_add = document.createTextNode('Arrange Board.');
        }
        else if (flag == true){
            parEle.innerHTML = '';
            tex_to_add = document.createTextNode('Move of: ' + game.turn());
        }
        
        parEle.appendChild(tex_to_add);
    }

</script>



<div class="container">
    {#if board==undefined}
        <div style="width: 400px; height:400px">
            Reload the page... 
        </div>
    {/if}
    <div>
        <label for="legal">
            <input type="checkbox" id="legal" name="legal" value="yes" on:click={checkLegal}>  Legal 
        </label>
        <p id="who-plays"></p>
    </div>
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