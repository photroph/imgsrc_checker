let x_origin;
let y_origin;

function dragStart(event) {
    x_origin = event.pageX;
    y_origin = event.pageY;

    document.body.addEventListener("dragend", dragEnd, false);
}

function dragEnd(event) {
    let x_dragend = event.pageX;
    let y_dragend = event.pageY;
    let top_dragged_element = Number(event.target.style.top.replace('px', ''));
    let left_dragged_element = Number(event.target.style.left.replace('px', ''));
    event.target.style.top = (top_dragged_element - y_origin + y_dragend) + 'px';
    event.target.style.left = (left_dragged_element - x_origin + x_dragend) + 'px';
    document.body.removeEventListener("dragend", dragEnd, false);
}

let already_run = 0;

chrome.extension.onRequest.addListener(function(){
    if(!already_run) {
        let img_srcs = [];
        let img_srcsets = [];
        let imgs = document.getElementsByTagName('IMG');
        for (let i = 0; i < imgs.length; i++){
            imgs[i].classList.add('img_in_this_page');
            img_srcs.push(imgs[i].src);
            img_srcsets.push(imgs[i].srcset.split(','));
        }
        const img_elmnts_in_page = document.getElementsByClassName('img_in_this_page');
        const num_imgs = img_elmnts_in_page.length;
        for (let i = 0; i < num_imgs; i++){
            let img_info_div = document.createElement('div');
            img_info_div.draggable = true;
            img_info_div.addEventListener('dragstart', dragStart, false);
            let close_btn = document.createElement('div');
            close_btn.style.display = 'inline-block';
            close_btn.style.width = '1.5rem';
            close_btn.style.height = '1.5rem';
            close_btn.style.color = '#fff';
            close_btn.style.backgroundColor = '#e74c3c';
            close_btn.style.textAlign = 'center';
            close_btn.style.cursor = 'pointer';
            close_btn.textContent = '×';
            close_btn.addEventListener('click', function(){
                this.parentNode.remove();
            }, false);
            img_info_div.appendChild(close_btn);
            let item_num = document.createElement('span');
            item_num.style.display = 'inline-block';
            item_num.style.marginLeft = '1rem';
            item_num.textContent = i + '/' + num_imgs;
            img_info_div.appendChild(item_num);

            // src
            let img_info_span_src = document.createElement('span');
            img_info_span_src.textContent = img_srcs[i];
            img_info_span_src.style.display = 'block';
            img_info_span_src.style.color = '#111';
            let img_elmnt = document.createElement('img');
            img_elmnt.src = img_srcs[i];
            img_info_div.appendChild(img_info_span_src);
            img_info_div.appendChild(img_elmnt);
            // srcset
            for (let j = 0; j < img_srcsets[i].length; j++){
                if(img_srcsets[i][j].includes('1x')){
                    img_srcsets[i][j] = img_srcsets[i][j].replace('1x', '');
                    img_srcsets[i][j] = img_srcsets[i][j].trim();
                    let img_info_span_1x = document.createElement('span');
                    img_info_span_1x.textContent += img_srcsets[i][j];
                    img_info_span_1x.style.display = 'block';
                    img_info_span_1x.style.color = '#111';
                    let img_1x = document.createElement('img');
                    img_1x.src = img_srcsets[i][j];
                    img_info_div.appendChild(img_info_span_1x);
                    img_info_div.appendChild(img_1x);
                }else if(img_srcsets[i][j].includes('2x')){
                    img_srcsets[i][j] = img_srcsets[i][j].replace(/(.*)2x/,"$1");
                    img_srcsets[i][j] = img_srcsets[i][j].trim();
                    let img_info_span_2x = document.createElement('span');
                    img_info_span_2x.textContent += img_srcsets[i][j];
                    img_info_span_2x.style.display = 'block';
                    img_info_span_2x.style.color = '#111';
                    let img_2x = document.createElement('img');
                    img_2x.src = img_srcsets[i][j];
                    img_info_div.appendChild(img_info_span_2x);
                    img_info_div.appendChild(img_2x);
                }
            }

            let img_x = img_elmnts_in_page[i].getBoundingClientRect().left;
            let img_y = img_elmnts_in_page[i].getBoundingClientRect().top;
            img_info_div.style.position = 'absolute';
            img_info_div.style.border = '2px solid #83CFF2';
            img_info_div.style.color = '#e74c3c';
            img_info_div.style.fontWeight = 'bold';
            img_info_div.style.textAlign = 'left';
            img_info_div.style.backgroundColor = '#fff';
            img_info_div.style.top = (window.pageYOffset + img_y) + 'px';
            img_info_div.style.left = (window.pageXOffset + img_x) + 'px';
            document.body.appendChild(img_info_div);
            console.log('img src : ' + img_srcs[i], 'img srcset : ', img_srcsets[i]);
        }
        already_run = true;
    }
})
