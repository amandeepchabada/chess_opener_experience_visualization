// color helpers
function genColorIndex(i) {
    const colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#bc80bd','#ccebc5','#ffed6f']
    return colors[i % colors.length]
}
export const pieceColoringMap = {
    'B': '#ffffb3',
    'N': '#bebada',
    'Q': '#fb8072',
    'R': '#80b1d3',
    'K': '#fdb462',
}
export const pieceNameColors = [
    ['Bishop', '#ffffb3'],
    ['Knight', '#bebada'],
    ['Queen', '#fb8072'],
    ['Rook', '#80b1d3'],
    ['King', '#fdb462'],
    ['Pawn', '#b3de69']
]
function genColorPiece(san) {
    // get piece char from beginning of san
    return pieceColoringMap[san[0]] || '#b3de69';  // if not defined, use pawn color
}
export function genColor({i, san}) {
    let c;
    if (san) return genColorPiece(san);
    else return genColorIndex(i);
}; 

