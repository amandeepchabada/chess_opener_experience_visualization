<script>
    import { curr_fen } from '../../stores';
    import * as eco_index from './eco_indexed.json';

    function construct_eco_list() {
        function helper(char, count) {
            return [...Array(count).keys()].map(
                el => el > 9 ? char+el : char+'0'+el
            );
        }
        return [].concat.apply([], ['A', 'B', 'C', 'D', 'E'].map(el=>helper(el, 100)) )  // map and concat
    }

    const eco_list = construct_eco_list()

    function set_eco(eco) {
        //console.log({eco});
        let obj = eco_index[eco];
        //console.log({obj});
        if (obj && obj[2].length > 5) {  // if valid fen
            let fen = obj[2] // obj format is [name, moves, fen]
            curr_fen.set(fen);
        }
        else {
            alert('invalid fen calculated for' +eco+ ', is json file complete?')
        }
    }

</script>

<div class='container'>
	{#each eco_list as  eco, eco_i}
        <button on:click={()=>set_eco(eco)}>
            {eco}
        </button>
    {/each}
</div>

<style>
    div.container {
        display: flex;
        flex-direction: row;
        max-width: 99vw;
        overflow-x: scroll;
    }
</style>