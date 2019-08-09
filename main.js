var board=new Array();
var score=0;
var hasConflicted=new Array();
var starx=0;
var stary=0;
var endx=0;
var endy=0;

$(document).ready(function() {
    prepareForMobile();
    newgame();
})
function prepareForMobile(){
    if(documentWidth>500){
        gridContainerWidth=500;
        cellSideLength=100;
        cellSpace=20;
    }
    $('#grid-container').css("width",gridContainerWidth-2*cellSpace);
    $('#grid-container').css("height",gridContainerWidth-2*cellSpace);
    $('#grid-container').css("padding",cellSpace+'px');
    $('#grid-container').css("border-radius",0.02*gridContainerWidth+'px');

    $('.grid-cell').css({
        width:cellSideLength+'px',
        height:cellSideLength,
        borderRadius:0.02*cellSideLength
    })
}
function newgame(){
    //初始化棋盘
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}
function init(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var gridcell=$("#grid-cell-"+i+"-"+j);
            gridcell.css("top",getPosTop(i,j));
            gridcell.css("left",getPosLeft(i,j));
        }
    }
    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for( var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    
    updataBoardView();
    score=0;
}
function updataBoardView(){
    $(".number-cell").remove();
    for(var i=0;i<4;i++){
        for( var j=0;j<4;j++){
           $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
           var theNumberCell=$('#number-cell-'+i+'-'+j);
           if(board[i][j]===0){
                theNumberCell.css("height","0px");
                theNumberCell.css("width","0px");
                theNumberCell.css("top",getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css("left",getPosLeft(i,j)+cellSideLength/2);

           }else{
            theNumberCell.css("height",cellSideLength+'px');
            theNumberCell.css("width",cellSideLength+'px');
            theNumberCell.css("top",getPosTop(i,j));
            theNumberCell.css("left",getPosLeft(i,j));
            theNumberCell.css("background-color",getNumberBGC(board[i][j]));
            theNumberCell.css("color",getNumberColor(board[i][j]));
            theNumberCell.text(board[i][j]);

           }
           hasConflicted[i][j]=false;
        }
        
    }
    $('.number-cell').css('line-height',cellSideLength+'px')
    $('.number-cell').css('font-size',0.6*cellSideLength+'px')
}
function generateOneNumber() {
    if(nospace(board))return false;
    //随机一个位置
    var randx = parseInt( Math.floor(Math.random()*4));
    var randy = parseInt( Math.floor(Math.random()*4));
    var times=0;
    while (times) {
        if (board[randx][randy]===0) {
            break;
        }
        var randx = parseInt( Math.floor(Math.random()*4));
        var randy = parseInt( Math.floor(Math.random()*4));
        times++;
    }
    if(times==50){
        for(var i=0;i<4;i++){
            for(var j=1;j<4;j++){
                if(board[i][j]===0){
                    randx=i;
                    randy=j;
                }
            }
        }
    }
    //随机一个数字
    var randnum=Math.random()<0.5?2:4;
    //在随机位置上显示随机数字
    board[randx][randy]=randnum;
    showNumberAnimation(randx,randy,randnum);
    return true;
}
$(document).keydown(function (e) {
    
    switch(e.keyCode){

        case 37://left
        e.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()"
                , 300);
            }
        break;
        case 38://top
        e.preventDefault();
            if(moveTop()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()"
                , 300);
            }
        break;
        case 39://right
        e.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()"
                , 300);
            }
        break;
        case 40://down
        e.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()"
                , 300);
            }
        break;
        default://
        break;
    }
});
document.addEventListener('touchstart',function(e){
    starx=e.touches[0].pageX;
    stary=e.touches[0].pageY
})
document.addEventListener('touchmove',function(e){
    e.preventDefault();
})
document.addEventListener('touchend',function(e){
    endx=e.changedTouches[0].pageX;
    endy=e.changedTouches[0].pageY;
    var deltax=endx-starx;
    var deltay=endy-stary;

    if(Math.abs(deltax)<0.1*documentWidth&&Math.abs(deltay)<0.1*documentWidth)return;
    //Math.abs(num)绝对值
    //x
    if(Math.abs(deltax)>=Math.abs(deltay)){
        if(deltax>0){//right
            if(moveRight()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()"
                , 300);
            }
            
        }
        else{//left
            if(moveLeft()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()"
                , 300);
            }
           
        }
    }else{//y
        if(deltay>0){//down
            if(moveDown()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()"
                , 300);
            }
        }
        else{//top
            if(moveTop()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()"
                , 300);
            }
            
        }
    }
})

function moveLeft(){
    if(!canMoveLeft(board))return false;
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if (board[i][j]!=0) {
                for(var k=0;k<j;k++){
                    if(board[i][k]===0&&noBlockHorizontal(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]===board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
                        //move&&add

                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updataScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updataBoardView()",200)
    return true;
}
function moveRight(){
    if(!canMoveRight(board))return false;
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            if (board[i][j]!=0) {
                for(var k=3;k>j;k--){
                    if(board[i][k]===0&&noBlockHorizontal(i,j,k,board)){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]===board[i][j]&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[i][k]){
                        //move&&add
                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updataScore(score);
                         hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updataBoardView()",200)
    return true;
}
function moveDown(){
    if(!canMoveDown(board))return false;
    for(var i=2;i>=0;i--){
        for(var j=0;j<4;j++){
            if (board[i][j]!=0) {
                for(var k=3;k>i;k--){
                    if(board[k][j]===0&&noBlockVertical(i,k,j,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]===board[i][j]&&noBlockVertical(i,k,j,board)&&!hasConflicted[i][k]){
                        //move&&add
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updataScore(score); 
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updataBoardView()",200)
    return true;
}
function moveTop(){
    if(!canMoveTop(board))return false;
    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){
            if (board[i][j]!=0) {
                for(var k=0;k<i;k++){
                    if(board[k][j]===0&&noBlockVertical(k,i,j,board)){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[k][j]===board[i][j]&&noBlockVertical(k,i,j,board)&&!hasConflicted[i][k]){
                        //move&&add
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updataScore(score); 
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updataBoardView()",200)
    return true;
}

function isgameover() {
    if(nospace(board)&&nomove(board)){
        gameover();
    }
}
function gameover(){
    alert("over");
}
