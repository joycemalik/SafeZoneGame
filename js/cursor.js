// The cursor code remains the same
document.body.style.cursor = 'none';

let cursorTrail = document.getElementById('cursorTrail');
const cursorImg = document.createElement('img');
cursorImg.src = 'images/cursor-gun.png';
cursorImg.style.width='32px';
cursorImg.style.height='32px';
cursorImg.style.position='absolute';
cursorImg.style.zIndex='9999';
cursorImg.style.pointerEvents='none';
cursorTrail.appendChild(cursorImg);

document.addEventListener('mousemove', (e) => {
    cursorImg.style.left = (e.pageX - 16) + 'px';
    cursorImg.style.top = (e.pageY - 16) + 'px';
});

function createTrail(x,y) {
    const dot = document.createElement('div');
    dot.style.position='absolute';
    dot.style.left=x+'px';
    dot.style.top=y+'px';
    dot.style.width='5px';
    dot.style.height='5px';
    dot.style.borderRadius='50%';
    dot.style.background='#0ff';
    dot.style.opacity='1';
    dot.style.pointerEvents='none';
    cursorTrail.appendChild(dot);

    anime({
        targets:dot,
        opacity:0,
        translateY:-10,
        duration:1000,
        easing:'easeOutQuad',
        complete: function() {
            dot.remove();
        }
    });
}

document.addEventListener('mousemove', (e) => {
    createTrail(e.pageX, e.pageY);
});
