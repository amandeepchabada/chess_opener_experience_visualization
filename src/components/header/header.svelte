<script>
    import { gameDataStore } from '../../state';
</script>

<div class='container'>
    <h1>
        Chessboard Visualization:
        A project for CS549 Visual Analytics
    </h1>
    <a href='https://learningchess.net/us/app/jsLesson.php'>
        <button>
        What is "e4"?? Learn chess here
        </button>
    </a>
</div>

<style>
    h1 {
        padding-left: 5px;
        padding-right: 5px;
    }

    button {
        float: right;
        background-color: rgb(88, 88, 112);
        color: rgb(255, 255, 255);
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 10px;
        top: 0; left: 0; bottom: 20%; right: 20%;
    }

    div.container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: black;
        color: whitesmoke;
    }
</style>